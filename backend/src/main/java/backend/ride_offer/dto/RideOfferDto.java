package backend.ride_offer.dto;

import java.time.LocalDateTime;

import backend.ride_offer.RideOffer;
import backend.ride_offer.enums.StatusOffer;
import backend.shared.enums.Neighborhoods;
import backend.user.dto.UserSummaryDto;
import backend.vehicle.VehicleDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RideOfferDto {    
    
    private Long id;
    private UserSummaryDto driver;
    private VehicleDto vehicle;
    private int seatsCapacity;
    private int seatsTaken;
    private Neighborhoods origin;
    private Neighborhoods destination;
    private StatusOffer status;
    private LocalDateTime departureDateTime;
    private String description;

    public RideOfferDto(RideOffer rideOffer) {
        this.id = rideOffer.getId();
        this.driver = new UserSummaryDto(rideOffer.getDriver());
        this.vehicle = rideOffer.getVehicle();
        this.seatsCapacity = rideOffer.getSeatsCapacity();
        this.seatsTaken = rideOffer.getSeatsTaken();
        this.origin = rideOffer.getOrigin();
        this.destination = rideOffer.getDestination();
        this.status = rideOffer.getStatus();
        this.departureDateTime = rideOffer.getDepartureDateTime();
        this.description = rideOffer.getDescription();
    }
}