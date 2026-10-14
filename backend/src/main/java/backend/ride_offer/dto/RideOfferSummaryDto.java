package backend.ride_offer.dto;

import java.time.LocalDateTime;

import backend.ride_offer.RideOffer;
import backend.ride_offer.enums.StatusOffer;
import backend.user.Neighborhoods;
import backend.user.dto.UserSummaryDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RideOfferSummaryDto {

    private Long id;
    private UserSummaryDto driver;
    private int seatsCapacity;
    private int seatsTaken;
    private Neighborhoods origin;
    private Neighborhoods destination;
    private LocalDateTime departureDateTime;
    private StatusOffer status;

    public RideOfferSummaryDto(RideOffer rideOffer) {
        this.id = rideOffer.getId();
        this.driver = new UserSummaryDto(rideOffer.getDriver());
        this.seatsCapacity = rideOffer.getSeatsCapacity();
        this.seatsTaken = rideOffer.getSeatsTaken();
        this.origin = rideOffer.getOrigin();
        this.destination = rideOffer.getDestination();
        this.departureDateTime = rideOffer.getDepartureDateTime();
        this.status = rideOffer.getStatus();
    }
}
