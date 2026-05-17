export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionObj {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}
