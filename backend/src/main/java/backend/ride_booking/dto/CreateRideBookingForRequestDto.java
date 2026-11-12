package backend.ride_booking.dto;

import jakarta.validation.constraints.NotNull;

public record CreateRideBookingForRequestDto (
    @NotNull 
    Long rideOfferId
){}
