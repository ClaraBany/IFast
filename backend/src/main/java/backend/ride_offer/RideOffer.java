package backend.ride_offer;

import java.time.LocalDateTime;

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
    @JoinColumn(name = "driver_id")
    private User driver;

    @Convert(converter = VehicleDtoConverter.class)
    @Column(columnDefinition = "json")
    private VehicleDto vehicle;

    @Column(nullable = false)
    private int seatsCapacity;

    private int seatsTaken = 0;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods origin;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods destination;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusOffer status;

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

    //TODO: adicionar ride_offer_template
    // @Column(nullable = true)
    // private String ride_offer_template;
}