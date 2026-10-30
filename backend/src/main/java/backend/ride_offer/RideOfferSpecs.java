package backend.ride_offer;

import java.time.LocalDateTime;

import backend.shared.dto.FilterRideDto;
import backend.shared.RideFilterSpecs;
import org.springframework.data.jpa.domain.Specification;

import backend.ride_offer.enums.StatusOffer;

public class RideOfferSpecs {

    private RideOfferSpecs() {}

    public static Specification<RideOffer> withFilter(FilterRideDto filter) {
        return Specification.<RideOffer>where(
            (root, query, cb) ->
                cb.equal(root.get("status"), StatusOffer.AVAILABLE))
            .and((root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("departureDateTime"), LocalDateTime.now()))
            .and(RideFilterSpecs.hasOrigin(filter.origin()))
            .and(RideFilterSpecs.hasDestination(filter.destination()))
            .and(RideFilterSpecs.onDay(filter.date(), "departureDateTime"))
            .and(RideFilterSpecs.inPeriod(filter.period(), "departureDateTime"));
    }
}
