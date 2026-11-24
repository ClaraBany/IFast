import { Trash2, LoaderCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Ripples } from "react-ripples-continued";
import { del, markAsRead } from "./notificationService";
import type { NotificationDto } from "./notificationTypes";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";

type NotificationCardProps = {
  notification: NotificationDto;
};

export default function NotificationCard({ notification }: NotificationCardProps) {
  const { time } = formatDepartureDateTime(notification.createdAt);
  const queryClient = useQueryClient();

  const { mutate: deleteNotification, isPending } = useMutation({
    mutationFn: (id: number) => del(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: read } = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className={`card-container ${notification.read ? "border-neutral-dark" : "border-primary"}`}>
      <Link
        to={`/offers/${notification.rideOfferId}`}
        onClick={() => {
          if (!notification.read) read(notification.id);
        }}
        className="flex flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']"
      >
        <p className={`text-label ${notification.read ? "text-neutral-dark" : "text-primary"}`}>
          {notification.title} - {time}
        </p>
        <p>{notification.message}</p>
      </Link>

      <button
        className="icon-btn h-fit self-center text-danger"
        onClick={() => deleteNotification(notification.id)}
        disabled={isPending}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        <Ripples color="var(--ripple-dark)" />
      </button>
    </div>
  );
}
