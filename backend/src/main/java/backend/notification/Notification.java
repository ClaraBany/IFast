package backend.notification;

import backend.ride_offer.RideOffer;
import backend.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table (name = "notification")
@EntityListeners (AuditingEntityListener.class)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false) //255 caracteres
    private String message;

    @Setter(AccessLevel.NONE)
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_offer_id", nullable = false)
    private RideOffer rideOffer;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Notification(String title, String message, RideOffer rideOffer, User user) {
        this.title = title;
        this.message = message;
        this.rideOffer = rideOffer;
        this.user = user;
    }

    public void markAsRead() {
        this.read = true;
    }
}
