package backend.ride_request;

import java.time.LocalDateTime;

import backend.ride_request.enums.StatusRequest;
import backend.shared.dto.FilterRideDto;
import backend.shared.RideFilterSpecs;
import org.springframework.data.jpa.domain.Specification;

public class RideRequestSpecs {

    private RideRequestSpecs() {}

    public static Specification<RideRequest> withFilter(FilterRideDto filter, Long userId) {
        return Specification.<RideRequest>where(
            (root, query, cb) ->
                cb.equal(root.get("status"), StatusRequest.PENDING))
            .and((root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("desiredDepartureEnd"), LocalDateTime.now()))
            .and(RideFilterSpecs.differentUser(userId, "requester"))
            .and(RideFilterSpecs.hasOrigin(filter.origin()))
            .and(RideFilterSpecs.hasDestination(filter.destination()))
            .and(RideFilterSpecs.onDay(filter.date(), "desiredDepartureStart"))
            .and(RideFilterSpecs.inPeriod(filter.period(), "desiredDepartureStart"));
    }
}
