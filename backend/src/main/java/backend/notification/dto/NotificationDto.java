package backend.notification.dto;

import backend.notification.Notification;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private boolean read;
    private Long rideOfferId;
    private LocalDateTime createdAt;

    public NotificationDto(Notification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.read = notification.isRead();
        this.rideOfferId = notification.getRideOffer().getId();
        this.createdAt = notification.getCreatedAt();
    }
}
