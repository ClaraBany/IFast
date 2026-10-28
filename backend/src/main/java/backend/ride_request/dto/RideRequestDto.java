package backend.ride_request.dto;

import backend.ride_request.RideRequest;
import backend.shared.enums.Neighborhoods;
import backend.user.dto.UserSummaryDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RideRequestDto {
    private Long id;
    private UserSummaryDto requester;
    private Neighborhoods origin;
    private Neighborhoods destination;
    private LocalDateTime desiredDepartureStart;
    private LocalDateTime desiredDepartureEnd;


    public RideRequestDto(RideRequest rideRequest) {
        this.id = rideRequest.getId();
        this.requester = new UserSummaryDto(rideRequest.getRequester());
        this.origin = rideRequest.getOrigin();
        this.destination = rideRequest.getDestination();
        this.desiredDepartureStart = rideRequest.getDesiredDepartureStart();
        this.desiredDepartureEnd = rideRequest.getDesiredDepartureEnd();
    }
}
