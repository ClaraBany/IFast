package backend.ride_offer.dto;

import java.time.LocalDate;

import backend.shared.enums.Period;
import backend.shared.enums.Neighborhoods;
import jakarta.validation.constraints.FutureOrPresent;

public record FilterRideOfferDto(
    Period period,

    @FutureOrPresent 
    LocalDate date,

    Neighborhoods origin,
    
    Neighborhoods destination
) {
}
