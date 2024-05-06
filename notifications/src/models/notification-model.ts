export interface NotificationModel {
  id: number;
  message: string;
  date: Date;
}

export interface CreateNotificationRequest {
	message: string;
}
