import {
  UserValidationResponse,
  UserDataResponse,
  AttendanceUpdateRequest,
  AttendanceUpdateResponse,
} from "@/types";


// Client should call our server-side proxy; that proxy will contact the external API
const API_BASE_URL = "/api/proxy";
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const API_DEBUG = process.env.NEXT_PUBLIC_API_DEBUG === "true";

// NOTE: do NOT use credentials on the client. The server proxy uses process.env.API_USERNAME / API_PASSWORD.

// Lightweight secure logger that prefers an app-provided diag logger
const diag = (globalThis as any).diag;
const logger = {
  info: (...args: any[]) => {
    if (diag && typeof diag.info === "function") return diag.info("api", ...args);
    if (API_DEBUG) console.info("[api]", ...args);
  },
  debug: (...args: any[]) => {
    if (diag && typeof diag.debug === "function") return diag.debug("api", ...args);
    if (API_DEBUG) console.debug("[api]", ...args);
  },
  warn: (...args: any[]) => {
    if (diag && typeof diag.warn === "function") return diag.warn("api", ...args);
    if (API_DEBUG) console.warn("[api]", ...args);
  },
  error: (...args: any[]) => {
    if (diag && typeof diag.error === "function") return diag.error("api", ...args);
    console.error("[api]", ...args);
  },
};

if (process.env.NODE_ENV === "development" && API_DEBUG) {
  logger.info("API Configuration:", {
    proxyBase: API_BASE_URL,
    useMockApi: USE_MOCK_API,
  });
}

function redactId(id?: string) {
  if (!id) return "N/A";
  if (id.length <= 6) return id.slice(0, 1) + "***" + id.slice(-1);
  return id.slice(0, 2) + "***" + id.slice(-2);
}

function redactSearch(s: string | undefined) {
  if (!s) return "N/A";
  if (s.includes("@")) {
    const [local, domain] = s.split("@");
    const localRedacted = local.length <= 2 ? local[0] + "***" : local[0] + "***" + local.slice(-1);
    return `${localRedacted}@${domain}`;
  }
  return redactId(s);
}


/**
 * Format month string from "2025-12" to "December 2025"
 */
function formatMonth(monthString: string): string {
  const [year, month] = monthString.split("-");
  if (!year || !month) {
    return monthString; // Return original if format is invalid
  }
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11 || isNaN(monthIndex)) {
    return monthString; // Return original if month is invalid
  }
  return `${monthNames[monthIndex]} ${year}`;
}
/**
 * Retry logic for fetch requests
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (response.ok) {
        return response;
      }
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000); // Exponential backoff
        logger.debug(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}


/**
 * API 1: Search/Validate User
 * GET /V1/events/searchuser?search={email_or_phone}
 */
export async function validateUser(
  emailOrPhone: string
): Promise<UserValidationResponse> {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    logger.debug("[MOCK API] Validating user:", redactSearch(emailOrPhone));
    const { mockValidateUser } = await import("./mockData");
    return mockValidateUser(emailOrPhone);
  }

  try {
    // Clean the search query (remove spaces, special characters except @ and +)
    const cleanSearch = emailOrPhone.trim();
    
    const url = `${API_BASE_URL}/searchuser?search=${encodeURIComponent(cleanSearch)}`;
    
    logger.debug("Validating user", { search: redactSearch(cleanSearch) });
    
    const response = await fetchWithRetry(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      2 // 2 retries for validation
    );

    const data: UserValidationResponse = await response.json();
    
    // Check if user was found
    if (data.status === "200" && data.log === "TRUE" && data.data) {
      logger.info("User found", { userId: redactId(data.data) });
      return data;
    } else {
      return {
        status: data.status || "404",
        log: "FALSE",
        message: "User not found in our system",
      };
    }
  } catch (error) {
    logger.error("User validation error:", error);
    
    return {
      status: "500",
      log: "FALSE",
      message: error instanceof Error
        ? error.message
        : "Unable to validate user. Please check your connection.",
    };
  }
}

/**
 * API 2: Fetch User Event Logs
 * GET /V1/events/logs?id={user_id}
 */
export async function fetchUserData(
  userId: string
): Promise<UserDataResponse> {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    logger.debug("[MOCK API] Fetching user data for:", redactId(userId));
    const { mockFetchUserData } = await import("./mockData");
    return mockFetchUserData(userId);
  }

  try {
    const url = `${API_BASE_URL}/logs?id=${encodeURIComponent(userId)}`;
    
    logger.debug("Fetching user data", { userId: redactId(userId) });
    
    const response = await fetchWithRetry(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      3 // 3 retries for data fetch
    );

    const data: UserDataResponse = await response.json();
    
    if (data.status === "200" && data.log === "TRUE" && data.data) {
      const d = data.data;
      const summary = {
        identity: redactId(d.identity),
        totalAttendance: d.TOTAL_ATTENDANCE,
        totalAttendanceOnSunday: d.TOTAL_ATTENDANCE_ON_SUNDAY,
        longestStreak: d.LONGEST_STREAK,
        highestActivityMonth: d.HIGHEST_ACTIVITY_MONTH?.month,
        highestActivityMonthCount: d.HIGHEST_ACTIVITY_MONTH?.count,
      };
      logger.info("User data retrieved", summary);
      return data;
    } else {
      return {
        status: data.status || "404",
        log: "FALSE",
        message: "Unable to retrieve user data",
      };
    }
  } catch (error) {
    logger.error("User data fetch error:", error);
    
    return {
      status: "500",
      log: "FALSE",
      message: error instanceof Error
        ? error.message
        : "Unable to fetch user data. Please try again.",
    };
  }
}

/**
 * API 3: Update Attendance
 * NOTE: Update this endpoint URL based on your actual backend
 */
export async function updateAttendance(
  request: AttendanceUpdateRequest
): Promise<AttendanceUpdateResponse> {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    logger.debug("[MOCK API] Updating attendance for userId:", redactId(request.userId));
    const { mockUpdateAttendance } = await import("./mockData");
    return mockUpdateAttendance();
  }

  try {
    const url = `${API_BASE_URL}/update-attendance`;

    const response = await fetchWithRetry(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
      3
    );

    const data: AttendanceUpdateResponse = await response.json();
    return data;
  } catch (error) {
    logger.error("Attendance update error:", error);

    return {
      status: "500",
      log: "FALSE",
      message: error instanceof Error
        ? error.message
        : "Unable to update attendance.",
    };
  }
}
