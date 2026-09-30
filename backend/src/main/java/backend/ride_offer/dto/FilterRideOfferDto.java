package backend.ride_offer.dto;

import java.time.LocalDate;

import backend.ride_offer.Shift;
import backend.user.Neighborhoods;

public record FilterRideOfferDto(
    Shift shift,
    LocalDate date,
    Neighborhoods origin,
    Neighborhoods destination
) {
}
