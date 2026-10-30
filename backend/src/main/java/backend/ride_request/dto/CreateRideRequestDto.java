package backend.ride_request.dto;

import backend.shared.enums.Neighborhoods;
import backend.shared.validation.MaxDaysAhead;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CreateRideRequestDto(
    @NotNull(message = "Escolha uma origem válida")
    Neighborhoods origin,

    @NotNull(message = "Escolha um destino válido")
    Neighborhoods destination,

    @NotNull(message = "Informe o horário inicial desejado")
    @FutureOrPresent(message = "O horário inicial não pode estar no passado")
    @MaxDaysAhead()
    LocalDateTime desiredDepartureStart,

    @NotNull(message = "Informe o horário final desejado")
    @FutureOrPresent(message = "O horário final não pode estar no passado")
    @MaxDaysAhead()
    LocalDateTime desiredDepartureEnd
) {
    @AssertTrue(message = "O horário final deve ser depois do inícial")
    public boolean isEndAfterStart() {
        return desiredDepartureEnd == null
                || desiredDepartureStart == null
                || desiredDepartureEnd.isAfter(desiredDepartureStart);
    }

    @AssertTrue(message = "Origem e destino devem ser diferentes")
    public boolean isOriginDifferentFromDestination() {
        return origin == null || !origin.equals(destination);
    }

    @AssertTrue(message = "Horário inicial e final devem ser no mesmo dia")
    public boolean isStartAndEndSameDay() {
        return desiredDepartureStart == null
                || desiredDepartureEnd == null
                || desiredDepartureStart.toLocalDate().equals(desiredDepartureEnd.toLocalDate());
    }
}
