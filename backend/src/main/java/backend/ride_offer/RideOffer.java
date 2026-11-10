package backend.ride_offer;

import java.time.LocalDateTime;

import backend.ride_offer.exceptions.InvalidRideOfferStateException;
import backend.ride_offer.exceptions.InvalidSeatsCapacityException;
import backend.ride_offer.exceptions.RideOfferNotDepartedException;
import lombok.AccessLevel;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import backend.shared.enums.Neighborhoods;
import backend.user.User;
import backend.vehicle.VehicleDto;
import backend.vehicle.VehicleDtoConverter;
import backend.ride_offer.enums.StatusOffer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
@Entity
@Table(name = "ride_offer")
@EntityListeners(AuditingEntityListener.class)
public class RideOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Convert(converter = VehicleDtoConverter.class)
    @Column(columnDefinition = "json")
    private VehicleDto vehicle;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    private int seatsCapacity;

    @Setter(AccessLevel.NONE)
    private int seatsTaken = 0;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods origin;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods destination;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusOffer status = StatusOffer.AVAILABLE;

    @Column(nullable = false)
    private LocalDateTime departureDateTime;

    @Column(nullable = true, length = 500)
    private String description;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private void refreshAvailability() {
        requireOpen();
        this.status = seatsTaken >= seatsCapacity ? StatusOffer.FULL : StatusOffer.AVAILABLE;
    }

    public void changeCapacity(int newCapacity) {
        requireOpen();

        if (newCapacity <= 0 || newCapacity < seatsTaken) {
            throw new InvalidSeatsCapacityException();
        }

        this.seatsCapacity = newCapacity;
        refreshAvailability();
    }

    public void complete() {
        requireOpen();

        if (LocalDateTime.now().isBefore(this.getDepartureDateTime())) {
            throw new RideOfferNotDepartedException();
        }

        this.status = StatusOffer.COMPLETED;
    }

    public void cancel() {
        requireOpen();
        this.status = StatusOffer.CANCELLED;
    }

    public void occupySeat() {
        if (this.status != StatusOffer.AVAILABLE) {
            throw new InvalidRideOfferStateException();
        }

        seatsTaken++;
        refreshAvailability();
    }

    public void requireOpen() {
        if (status != StatusOffer.AVAILABLE && status != StatusOffer.FULL) {
            throw new InvalidRideOfferStateException();
        }
    }

    public void releaseSeat() {
        if (this.seatsTaken <= 0) throw new IllegalStateException();

        this.seatsTaken--;
        refreshAvailability();
    }

    //TODO: adicionar ride_offer_template
    // @Column(nullable = true)
    // private String ride_offer_template;
}