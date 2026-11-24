package backend.notification;

import backend.notification.dto.NotificationDto;
import backend.notification.dto.NotificationPageDto;
import backend.ride_offer.RideOffer;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationPageDto getAll(User user, Pageable pageable) {
        Slice<NotificationDto> slice = notificationRepository
                .findByUserOrderByCreatedAtDesc(user, pageable)
                .map(NotificationDto::new);

        return new NotificationPageDto(slice.getContent(), slice.hasNext());
    }

    public Long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public void createForUsers(String title, String message, RideOffer rideOffer, Collection<User> users) {
        List<Notification> notifications = users.stream()
                .distinct()
                .map(user -> new Notification(title, message, rideOffer, user))
                .toList();

        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void create(String title, String message, RideOffer rideOffer, User user) {
        createForUsers(title, message, rideOffer, List.of(user));
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
            .orElseThrow(EntityNotFoundException::new);

        notification.markAsRead();
        notificationRepository.save(notification);
    }

    @Transactional
    public void delete(Long notificationId, User user) {
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
            .orElseThrow(EntityNotFoundException::new);

        notificationRepository.delete(notification);
    }
}
