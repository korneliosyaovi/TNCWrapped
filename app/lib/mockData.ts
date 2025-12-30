import {
  UserValidationResponse,
  UserDataResponse,
  AttendanceUpdateResponse,
} from "@/app/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database matching real API structure
const MOCK_USERS = [
  {
    search: "test@example.com",
    userId: "2348109328188",
    data: {
      identity: "2348109328188",
      TOTAL_ATTENDANCE: 42,
      TOTAL_ATTENDANCE_ON_SUNDAY: 38,
      LONGEST_STREAK: 8,
      HIGHEST_ACTIVITY_MONTH: {
        month: "2024-12",
        count: 12
      }
    }
  },
   {
     search: "user2@example.com",
     userId: "2348109328189",
    data: {
      identity: "2348109328189",
      TOTAL_ATTENDANCE: 15,
      TOTAL_ATTENDANCE_ON_SUNDAY: 14,
      LONGEST_STREAK: 3,
      HIGHEST_ACTIVITY_MONTH: {
        month: "2025-12",
        count: 4
      }
    }
  },
  {
    search: "demo@test.com",
    userId: "2349012345678",
    data: {
      identity: "2349012345678",
      TOTAL_ATTENDANCE: 48,
      TOTAL_ATTENDANCE_ON_SUNDAY: 45,
      LONGEST_STREAK: 15,
      HIGHEST_ACTIVITY_MONTH: {
        month: "2024-11",
        count: 14
      }
    }
  },
  {
    search: "+2348109328188",
    userId: "2348109328190",
    data: {
      identity: "2348109328190",
      TOTAL_ATTENDANCE: 15,
      TOTAL_ATTENDANCE_ON_SUNDAY: 14,
      LONGEST_STREAK: 3,
      HIGHEST_ACTIVITY_MONTH: {
        month: "2025-12",
        count: 4
      }
    }
  },
];
export async function mockValidateUser(
  search: string
): Promise<UserValidationResponse> {
  await delay(1000);

  const user = MOCK_USERS.find(
    (u) => u.search.toLowerCase() === search.toLowerCase()
  );

  if (user) {
    return {
      status: "200",
      log: "TRUE",
      data: user.userId,
    };
  }

  return {
    status: "404",
    log: "FALSE",
    message: "User not found in our system",
  };
}

export async function mockFetchUserData(
  userId: string
): Promise<UserDataResponse> {
  await delay(1200);

  const user = MOCK_USERS.find((u) => u.userId === userId);

  if (user) {
    return {
      status: "200",
      log: "TRUE",
      data: user.data,
    };
  }

  return {
    status: "404",
    log: "FALSE",
    message: "User data not found",
  };
}

export async function mockUpdateAttendance(): Promise<AttendanceUpdateResponse> {
  await delay(800);

  return {
    status: "200",
    log: "TRUE",
    message: "Attendance updated successfully",
  };
}