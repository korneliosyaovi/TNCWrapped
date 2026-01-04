"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ScreenId, FlowState, FlowActions, UserData } from "@/types";
import * as api from "@/lib/api";
import { calculatePersona, calculateAttendancePercentage } from "@/lib/persona";

const SCREEN_ORDER: ScreenId[] = [
  "welcome",
  "before-we-begin",
  "attendance-total",
  "streak",
  "top-month-intro",
  "top-month-detail",
  "feast-shofar",
  "oxygen",
  "nxt-conference",
  "favorite-moments",
  "persona",
];

type FlowContextType = FlowState & FlowActions;

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("welcome");
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(["welcome"]);
  const [userData, setUserData] = useState<UserData>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LOCAL_STRORAGE_KEY = 'flowData';

  // Sync data with localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STRORAGE_KEY);
    if (savedData) {
      const { currentScreen, screenHistory, userData } = JSON.parse(savedData);
      // Use setTimeout to ensure the state is updated asynchronously
      setTimeout(() => {
        setCurrentScreen(currentScreen);
        setScreenHistory(screenHistory);
        setUserData(userData);
      }, 0);
    }
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    const flowData = {
      currentScreen,
      screenHistory,
      userData,
    };
    localStorage.setItem(LOCAL_STRORAGE_KEY, JSON.stringify(flowData));
  }, [currentScreen, screenHistory, userData]);

  // Navigation functions
  const goToScreen = useCallback((screenId: ScreenId) => {
    setIsTransitioning(true);
    setCurrentScreen(screenId);
    setScreenHistory((prev) => [...prev, screenId]);
    setTimeout(() => setIsTransitioning(false), 600);
  }, []);

  const nextScreen = useCallback(() => {
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    if (currentIndex < SCREEN_ORDER.length - 1) {
      const nextScreenId = SCREEN_ORDER[currentIndex + 1];
      goToScreen(nextScreenId);
    }
  }, [currentScreen, goToScreen]);

  const previousScreen = useCallback(() => {
    if (screenHistory.length > 1) {
      setIsTransitioning(true);
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  }, [screenHistory]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  }, []);

  /**
   * Validate user using The Roots Hive API
   */
  const validateUser = useCallback(async (emailOrPhone: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.validateUser(emailOrPhone);

      if (response.status === "200" && response.log === "TRUE" && response.data) {
        // User found - store the userId (which is their phone number)
        updateUserData({
          emailOrPhone,
          userId: response.data,
        });
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || "User not found");
        setIsLoading(false);
        return false;
      }
    } catch {
      setError("Failed to validate user");
      setIsLoading(false);
      return false;
    }
  }, [updateUserData]);

  /**
   * Fetch user data using The Roots Hive API
   */
  const fetchUserData = useCallback(async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.fetchUserData(userId);

      if (response.status === "200" && response.log === "TRUE" && response.data) {
        const {
          identity,
          TOTAL_ATTENDANCE,
          TOTAL_ATTENDANCE_ON_SUNDAY,
          LONGEST_STREAK,
          HIGHEST_ACTIVITY_MONTH,
        } = response.data;

        // Format the month string
        const monthFormatted = formatMonthString(HIGHEST_ACTIVITY_MONTH.month);

        // Calculate attendance percentage
        // Assuming 52 weeks in a year as total possible
        const totalPossible = 52;
        const percentage = calculateAttendancePercentage(
          TOTAL_ATTENDANCE,
          totalPossible
        );

        updateUserData({
          identity,
          totalAttendance: TOTAL_ATTENDANCE,
          totalAttendanceOnSunday: TOTAL_ATTENDANCE_ON_SUNDAY,
          longestStreak: LONGEST_STREAK,
          highestActivityMonth: monthFormatted,
          highestActivityMonthCount: HIGHEST_ACTIVITY_MONTH.count,
          attendancePercentage: percentage,
        });

        setIsLoading(false);
        return true;
      } else {
        setError(response.message || "Failed to fetch user data");
        setIsLoading(false);
        return false;
      }
    } catch {
      setError("Failed to fetch user data");
      setIsLoading(false);
      return false;
    }
  }, [updateUserData]);

  /**
   * Update attendance
   */
  const updateAttendance = useCallback(async (): Promise<boolean> => {
    if (!userData.userId) {
      setError("No user ID found");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.updateAttendance({
        userId: userData.userId,
        did_attend_feast: userData.didAttendFeast || false,
        did_attend_oxygen: userData.didAttendOxygen || false,
        did_attend_nxt: userData.didAttendNxt || false,
      });

      setIsLoading(false);
      return response.status === "200" && response.log === "TRUE";
    } catch {
      setError("Failed to update attendance");
      setIsLoading(false);
      return false;
    }
  }, [userData]);

  const setEventAttendance = useCallback((
    event: 'feast' | 'oxygen' | 'nxt',
    attended: boolean
  ) => {
    const updateMap = {
      feast: { didAttendFeast: attended },
      oxygen: { didAttendOxygen: attended },
      nxt: { didAttendNxt: attended },
    };
    updateUserData(updateMap[event]);
  }, [updateUserData]);

  const setFavoriteMoments = useCallback((moments: string[]) => {
    updateUserData({ favoriteMoments: moments });
  }, [updateUserData]);

  const setPersona = useCallback(() => {
    const persona = calculatePersona(userData);
    updateUserData({ persona });
  }, [userData, updateUserData]);

  const resetFlow = useCallback(() => {
    setCurrentScreen("welcome");
    setScreenHistory(["welcome"]);
    setUserData({});
    setIsTransitioning(false);
    setIsLoading(false);
    setError(null);
    localStorage.removeItem(LOCAL_STRORAGE_KEY);
  }, []);

  const value: FlowContextType = {
    currentScreen,
    screenHistory,
    userData,
    isTransitioning,
    isLoading,
    error,
    goToScreen,
    nextScreen,
    previousScreen,
    updateUserData,
    validateUser,
    fetchUserData,
    updateAttendance,
    setEventAttendance,
    setFavoriteMoments,
    setPersona,
    resetFlow,
    setLoading: setIsLoading,
    setError,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
}

/**
 * Format month string from "2025-12" to "December"
 */
function formatMonthString(monthString: string): string {
  if (typeof monthString !== "string") {
    return "Invalid date";
  }

  const parts = monthString.split("-");
  if (parts.length !== 2) {
    return "Invalid date";
  }

  const [, monthStr] = parts;

  // Basic numeric validation
  if (!/^\d+$/.test(monthStr)) {
    return "Invalid date";
  }

  const month = parseInt(monthStr, 10);
  if (Number.isNaN(month) || month < 1 || month > 12) {
    return "Invalid date";
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[month - 1];
}
