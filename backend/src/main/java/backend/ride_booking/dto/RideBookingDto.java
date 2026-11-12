package backend.ride_booking.dto;

import backend.ride_booking.RideBooking;
import backend.ride_booking.enums.InitiatedBy;
import backend.ride_booking.enums.StatusBooking;
import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.ride_request.dto.RideRequestDto;
import backend.user.dto.UserSummaryDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
public class RideBookingDto {
    
    private Long id;
    private UserSummaryDto passenger;
    private RideOfferSummaryDto rideOffer; 
    private Long rideRequestId; 
    private StatusBooking status;
    private InitiatedBy initiatedBy;

    public RideBookingDto(RideBooking rideBooking) {
        this.id = rideBooking.getId();
        this.passenger = new UserSummaryDto(rideBooking.getPassenger());
        this.rideOffer = new RideOfferSummaryDto(rideBooking.getRideOffer());
        this.rideRequestId = rideBooking.getRideRequest() == null
            ? null
            : rideBooking.getRideRequest().getId();
        this.status = rideBooking.getStatus();
        this.initiatedBy = rideBooking.getInitiatedBy();
    }
}
