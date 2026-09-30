package backend.ride_offer;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import backend.user.Neighborhoods;
import backend.user.User;
import backend.vehicle.VehicleDto;
import backend.vehicle.VehicleDtoConverter;
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
    @JoinColumn(name = "user_id")
    private User user;

    @Convert(converter = VehicleDtoConverter.class)
    @Column(columnDefinition = "json")
    private VehicleDto vehicle;

    @Column(nullable = false)
    private int seats_capacity;

    private int seats_taken = 0;

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

    //data e hora
    // @Column(nullable = true)
    // private String ride_offer_template;
}