package backend.ride_offer.dto;

import java.time.LocalDateTime;

import backend.shared.validation.MaxDaysAhead;
import com.fasterxml.jackson.annotation.JsonIgnore;

import backend.shared.enums.Neighborhoods;
import backend.vehicle.VehicleDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRideOfferDto(
    @NotNull @Valid 
    VehicleDto vehicle,

    @NotNull
    @Min(value = 1, message = "A oferta deve ter no mínimo uma vaga")
    @Max (value = 4, message = "A oferta deve ter no máximo quatro vagas")
    Integer seatsCapacity,

    @NotNull(message = "Escolha uma origem válida")
    Neighborhoods origin,

    @NotNull(message = "Escolha um destino válido")
    Neighborhoods destination,

    @NotNull 
    @FutureOrPresent(message = "A data não pode ser anterior a hoje")
    @MaxDaysAhead()
    LocalDateTime departureDateTime,

    @Size(max = 500, message = "Máximo de 500 caracteres")
    String description,

    @NotNull
    Boolean isRoundTrip,

    @FutureOrPresent(message = "A data não pode ser anterior a hoje")
    @MaxDaysAhead()
    LocalDateTime returnDateTime
) {

    @JsonIgnore 
    @AssertTrue(message = "Data de retorno é obrigatória para viagem de ida e volta")
    public boolean isReturnDateTimeValid() {
        return !Boolean.TRUE.equals(isRoundTrip) || returnDateTime != null;
    }

    @JsonIgnore
    @AssertTrue(message = "Data de retorno deve ser posterior à data de saída")
    public boolean isReturnAfterDeparture() {
        return returnDateTime == null
            || departureDateTime == null
            || returnDateTime.isAfter(departureDateTime);
    }

    @JsonIgnore 
    @AssertTrue(message = "Origem e destino devem ser diferentes")
    public boolean isOriginDifferentFromDestination() {
        return origin == null || destination == null || !origin.equals(destination);
    }
}