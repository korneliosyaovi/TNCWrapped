export type ScreenId =
  | "welcome"
  | "before-we-begin"
  | "not-found"
  | "attendance-total"
  | "streak"
  | "top-month-intro"
  | "top-month-detail"
  | "feast-shofar"
  | "oxygen"
  | "nxt-conference"
  | "favorite-moments"
  | "persona";

/**
 * API 1: User Search/Validation
 * Endpoint: GET /V1/events/searchuser?search={email_or_phone}
 */
export interface UserValidationResponse {
  status: string;
  log: string; // "TRUE" or "FALSE"
  data?: string; // User ID (phone number format: "2348109328188")
  message?: string; // Error message if log is "FALSE"
}

/**
 * API 2: User Event Logs
 * Endpoint: GET /V1/events/logs?id={user_id}
 */
export interface UserDataResponse {
  status: string;
  log: string; // "TRUE" or "FALSE"
  data?: {
    identity: string;
    TOTAL_ATTENDANCE: number;
    TOTAL_ATTENDANCE_ON_SUNDAY: number;
    LONGEST_STREAK: number;
    HIGHEST_ACTIVITY_MONTH: {
      month: string; // Format: "2025-12"
      count: number;
    };
  };
  message?: string;
}

/**
 * API 3: Update Attendance (if you have this endpoint)
 * This needs to be confirmed with your backend team
 */
export interface AttendanceUpdateRequest {
  userId: string;
  did_attend_feast: boolean;
  did_attend_oxygen: boolean;
  did_attend_nxt: boolean;
}

export interface AttendanceUpdateResponse {
  status: string;
  log: string;
  message?: string;
}


export interface UserData {
  // From user input
  emailOrPhone?: string;
  
  // From API validation (searchuser)
  userId?: string; // This is the phone number ID
  
  // From API user data (logs)
  identity?: string;
  totalAttendance?: number;
  totalAttendanceOnSunday?: number;
  longestStreak?: number;
  highestActivityMonth?: string; // Formatted as "December 2025"
  highestActivityMonthCount?: number;
  attendancePercentage?: number;
  
  // Event attendance tracking
  didAttendFeast?: boolean;
  didAttendOxygen?: boolean;
  didAttendNxt?: boolean;
  
  // Favorite moments
  favoriteMoments?: string[];
  
  // Calculated persona
  persona?: PersonaType;
}

// TO-DO: update placeholder persona types and details
export type PersonaType =
  | "consistent-champion"
  | "dedicated-disciple"
  | "growing-believer"
  | "occasional-visitor"
  | "new-member";

export interface Persona {
  type: PersonaType;
  title: string;
  description: string;
  color: string;
  emoji: string;
}

// Flow context state
export interface FlowState {
  currentScreen: ScreenId;
  screenHistory: ScreenId[];
  userData: UserData;
  isTransitioning: boolean;
}

// Flow context actions
export interface FlowActions {
  goToScreen: (screenId: ScreenId) => void;
  nextScreen: () => void;
  previousScreen: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  validateUser: (emailOrPhone: string) => Promise<boolean>;
  fetchUserData: (userId: string) => Promise<boolean>;
  updateAttendance: () => Promise<boolean>;
  setEventAttendance: (event: 'feast' | 'oxygen' | 'nxt', attended: boolean) => void;
  setFavoriteMoments: (moments: string[]) => void;
  resetFlow: () => void;
  setLoading?: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading?: boolean;
  error?: string | null;
}

// Audio context state
export interface AudioState {
  currentTrack: string | null;
  isPlaying: boolean;
  isMuted: boolean;
  audioError: Error | null;
}

// Audio context actions
export interface AudioActions {
  playTrack: (trackUrl: string) => void;
  stopTrack: () => void;
  toggleMute: () => void;
  clearAudioError: () => void;
}

// Analytics event types
export type AnalyticsEvent = {
  name: string;
  params?: Record<string, any>;
};

export const ANALYTICS_EVENTS = {
  SCREEN_VIEWED: "screen_viewed",
  BUTTON_CLICKED: "button_clicked",
  EMAIL_SUBMITTED: "email_submitted",
  PHONE_SUBMITTED: "phone_submitted",
  API_REQUEST_STARTED: "api_request_started",
  API_REQUEST_SUCCESS: "api_request_success",
  API_REQUEST_FAILED: "api_request_failed",
  USER_VALIDATION_SUCCESS: "user_validation_success",
  USER_NOT_FOUND: "user_not_found",
} as const;