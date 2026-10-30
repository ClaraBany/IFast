package backend.ride_request;

import backend.ride_request.enums.StatusRequest;
import backend.ride_request.exceptions.InvalidRideRequestStateException;
import backend.shared.enums.Neighborhoods;
import backend.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "ride_request")
public class RideRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusRequest status = StatusRequest.PENDING;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods origin;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods destination;

    @Column(nullable = false)
    private LocalDateTime desiredDepartureStart;

    @Column(nullable = false)
    private LocalDateTime desiredDepartureEnd;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void accept() {
        requireOpen();
        this.status = StatusRequest.ACCEPTED;
    }

    public void cancel() {
        requireOpen();
        this.status = StatusRequest.CANCELLED;
    }

    public void requireOpen() {
        if (status != StatusRequest.PENDING) {
            throw new InvalidRideRequestStateException();
        }
    }
}
