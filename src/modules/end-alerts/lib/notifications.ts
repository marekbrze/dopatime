export type NotificationState = NotificationPermission | 'unsupported';

export function notificationState(): NotificationState {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
}

export async function requestNotifications(): Promise<NotificationState> {
  if (typeof Notification === 'undefined') return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function showNotification(title: string, body: string): Notification | null {
  if (notificationState() !== 'granted') return null;
  try {
    return new Notification(title, { body, tag: 'dopatime', requireInteraction: false });
  } catch {
    // Some mobile browsers only allow notifications through a service worker.
    return null;
  }
}
