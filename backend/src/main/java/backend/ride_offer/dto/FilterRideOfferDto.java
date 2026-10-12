package backend.ride_offer.dto;

import java.time.LocalDate;

import backend.ride_offer.Period;
import backend.user.Neighborhoods;

public record FilterRideOfferDto(
    Period period,
    LocalDate date,
    Neighborhoods origin,
    Neighborhoods destination
) {
}
