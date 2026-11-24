import { api } from "@shared/api";
import type { NotificationPageDto } from "./notificationTypes";

export async function getAll(page: number): Promise<NotificationPageDto> {
  const response = await api.get<NotificationPageDto>("/notifications", { params: { page } });
  return response.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await api.get<number>(`/notifications/unread-count`);
  return response.data;
}

export async function markAsRead(notificationId: number): Promise<void> {
  await api.patch<void>(`/notifications/${notificationId}/read`);
}

export async function del(notificationId: number): Promise<void> {
  await api.delete<void>(`/notifications/${notificationId}`);
}
