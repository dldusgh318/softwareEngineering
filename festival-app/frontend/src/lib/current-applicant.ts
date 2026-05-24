export const AUTH_STORAGE_KEY = "festival-app-current-user";

export type CurrentApplicant = {
  id: string;
  name: string;
};

const DEV_APPLICANT: CurrentApplicant = {
  id: "demo-user-1",
  name: "홍길동",
};

const DEV_APPLICANT_SNAPSHOT = JSON.stringify(DEV_APPLICANT);

export function getApplicantSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) ?? getDevelopmentApplicantSnapshot();
}

export function getStoredApplicant(): CurrentApplicant | null {
  return parseApplicantSnapshot(getApplicantSnapshot());
}

export function parseApplicantSnapshot(snapshot: string | null): CurrentApplicant | null {
  if (!snapshot) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(snapshot) as Partial<CurrentApplicant>;
    if (parsedUser.id && parsedUser.name) {
      return {
        id: parsedUser.id,
        name: parsedUser.name,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function subscribeToApplicantChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getDevelopmentApplicantSnapshot() {
  return isDevelopmentRuntime() ? DEV_APPLICANT_SNAPSHOT : null;
}

function isDevelopmentRuntime() {
  return process.env.NODE_ENV === "development" && process.env.VITEST !== "true";
}
