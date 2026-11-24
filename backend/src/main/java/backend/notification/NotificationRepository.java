package backend.notification;

import backend.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Slice<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Optional<Notification> findByIdAndUser(Long id, User user);
    long countByUserAndReadFalse(User user);
}
