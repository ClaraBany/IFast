package backend.ride_offer.dto;

import java.time.LocalDate;

import backend.ride_offer.Period;
import backend.user.Neighborhoods;
import jakarta.validation.constraints.FutureOrPresent;

public record FilterRideOfferDto(
    Period period,

    @FutureOrPresent 
    LocalDate date,

    Neighborhoods origin,
    
    Neighborhoods destination
) {
}
