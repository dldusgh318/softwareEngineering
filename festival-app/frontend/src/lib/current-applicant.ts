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
const applicantChangeListeners = new Set<() => void>();

let isLocalStoragePatched = false;

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
  patchLocalStorageForApplicantChange();
  applicantChangeListeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    applicantChangeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getDevelopmentApplicantSnapshot() {
  return isDevelopmentRuntime() ? DEV_APPLICANT_SNAPSHOT : null;
}

function isDevelopmentRuntime() {
  return process.env.NODE_ENV === "development" && process.env.VITEST !== "true";
}

function patchLocalStorageForApplicantChange() {
  if (isLocalStoragePatched || typeof window === "undefined") {
    return;
  }

  const storagePrototype = Object.getPrototypeOf(window.localStorage) as Storage;
  const originalSetItem = storagePrototype.setItem;
  const originalRemoveItem = storagePrototype.removeItem;
  const originalClear = storagePrototype.clear;

  storagePrototype.setItem = function setItem(key, value) {
    originalSetItem.call(this, key, value);
    if (key === AUTH_STORAGE_KEY) {
      notifyApplicantChange();
    }
  };

  storagePrototype.removeItem = function removeItem(key) {
    originalRemoveItem.call(this, key);
    if (key === AUTH_STORAGE_KEY) {
      notifyApplicantChange();
    }
  };

  storagePrototype.clear = function clear() {
    originalClear.call(this);
    notifyApplicantChange();
  };

  isLocalStoragePatched = true;
}

function notifyApplicantChange() {
  applicantChangeListeners.forEach((listener) => listener());
}
