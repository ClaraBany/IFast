export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  read: boolean;
  rideOfferId: number;
  createdAt: string;
}

export interface NotificationPageDto {
  content: NotificationDto[];
  hasNext: boolean;
}
