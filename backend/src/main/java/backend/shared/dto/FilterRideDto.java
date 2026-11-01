package backend.shared.dto;

import java.time.LocalDate;

import backend.shared.enums.Period;
import backend.shared.enums.Neighborhoods;
import jakarta.validation.constraints.FutureOrPresent;

public record FilterRideDto(
    Period period,

    @FutureOrPresent 
    LocalDate date,

    Neighborhoods origin,
    
    Neighborhoods destination
) {
}
