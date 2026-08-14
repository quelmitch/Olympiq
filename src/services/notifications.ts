import { setStorageItem, getStorageItem } from './storage';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'olympiq_notifications';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

export const getStoredNotifications = (): AppNotification[] => {
  return getStorageItem<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, []);
};

export const saveNotification = (notification: AppNotification) => {
  const current = getStoredNotifications();
  const updated = [notification, ...current].slice(0, 50); // Keep last 50
  setStorageItem(NOTIFICATIONS_STORAGE_KEY, updated);
};

export const markNotificationAsRead = (id: string) => {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  setStorageItem(NOTIFICATIONS_STORAGE_KEY, updated);
};

export const scheduleReminder = (
  title: string,
  body: string,
  triggerTime: number
) => {
  const delay = triggerTime - Date.now();

  if (delay <= 0) {
    // Trigger immediately if time passed
    triggerNotification(title, body);
    return;
  }

  // Set timeout for when app is active
  setTimeout(() => {
    triggerNotification(title, body);
  }, delay);

  // Note: For true background notifications when app is closed,
  // we would need to integrate with a Service Worker and Push API
  // or Alarm API, but that requires a backend for Push or specific
  // PWA manifest configurations. This is a best-effort client-side schedule.
};

const triggerNotification = (title: string, body: string) => {
  const notification: AppNotification = {
    id: crypto.randomUUID(),
    title,
    body,
    timestamp: Date.now(),
    read: false,
  };

  saveNotification(notification);
  showNotification(title, { body });

  // Dispatch event so UI can update
  window.dispatchEvent(new CustomEvent('olympiq-notification-triggered', { detail: notification }));
};
