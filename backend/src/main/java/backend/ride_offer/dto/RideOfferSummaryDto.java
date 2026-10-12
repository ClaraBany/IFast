package backend.ride_offer.dto;

import java.time.LocalDateTime;

import backend.ride_offer.RideOffer;
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
    private UserSummaryDto user;
    private int seatsCapacity;
    private int seatsTaken;
    private Neighborhoods origin;
    private Neighborhoods destination;
    private LocalDateTime departureDateTime;

    public RideOfferSummaryDto(RideOffer rideOffer) {
        this.id = rideOffer.getId();
        this.user = new UserSummaryDto(rideOffer.getUser());
        this.seatsCapacity = rideOffer.getSeats_capacity();
        this.seatsTaken = rideOffer.getSeats_taken();
        this.origin = rideOffer.getOrigin();
        this.destination = rideOffer.getDestination();
        this.departureDateTime = rideOffer.getDepartureDateTime();
    }
}
