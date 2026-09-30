package backend.ride_offer.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import backend.user.Neighborhoods;
import backend.vehicle.VehicleDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRideOfferDto(
    @NotNull @Valid 
    VehicleDto vehicle,

    @NotNull
    @Min(value = 1, message = "A oferta deve ter no mínimo uma vaga")
    Integer seatsCapacity,

    @NotNull
    Neighborhoods origin,

    @NotNull
    Neighborhoods destination,

    @NotNull @Future
    LocalDateTime departureDateTime,

    @Size(max = 500)
    String description,

    @NotNull
    Boolean roundTrip,

    @Future
    LocalDateTime returnDateTime
) {

    @JsonIgnore 
    @AssertTrue(message = "Data de retorno é obrigatória para viagem de ida e volta")
    public boolean isReturnDateTimeValid() {
        return !Boolean.TRUE.equals(roundTrip) || returnDateTime != null;
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