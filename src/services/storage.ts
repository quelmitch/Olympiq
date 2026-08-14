export const setStorageItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error);
    // QuotaExceededError or other errors can happen
  }
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key "${key}":`, error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage:`, error);
  }
};
