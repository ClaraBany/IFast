package backend.ride_booking;

import backend.ride_booking.enums.InitiatedBy;
import backend.ride_booking.enums.StatusBooking;
import backend.ride_booking.exceptions.InvalidRideBookingStateException;
import backend.ride_offer.RideOffer;
import backend.ride_request.RideRequest;
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
@Table(name = "ride_booking")
public class RideBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusBooking status = StatusBooking.PENDING;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InitiatedBy initiatedBy;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InitiatedBy cancelledBy;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @ManyToOne
    @JoinColumn(name = "ride_offer_id", nullable = false)
    private RideOffer rideOffer;

    @ManyToOne
    @JoinColumn(name = "ride_request_id", nullable = true)
    private RideRequest rideRequest;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void accept() {
        if (this.status != StatusBooking.PENDING) {
            throw new InvalidRideBookingStateException();
        }
        this.status = StatusBooking.ACCEPTED;
    }

    public void reject() {
        if (this.status != StatusBooking.PENDING) {
            throw new InvalidRideBookingStateException();
        }
        this.status = StatusBooking.REJECTED;
    }

    public void cancel() {
        if (status != StatusBooking.PENDING && status != StatusBooking.ACCEPTED) {
            throw new InvalidRideBookingStateException();
        }
        this.status = StatusBooking.CANCELLED;
    }
}
