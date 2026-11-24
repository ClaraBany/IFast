package backend.notification;

import backend.notification.dto.NotificationPageDto;
import backend.shared.dto.PaginationParamsDto;
import backend.user.User;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<NotificationPageDto> getAll(
            @AuthenticationPrincipal User user,
            @Valid PaginationParamsDto pagination
    ) {
        return ResponseEntity.ok(notificationService.getAll(user, pagination.toPageable()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal User user) {
        Long response = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId, @AuthenticationPrincipal User user) {
        notificationService.markAsRead(notificationId, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> delete(@PathVariable Long notificationId, @AuthenticationPrincipal User user) {
        notificationService.delete(notificationId, user);
        return ResponseEntity.noContent().build();
    }
}
