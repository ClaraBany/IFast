package backend.ride_offer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import backend.ride_offer.dto.FilterRideOfferDto;
import backend.shared.enums.Period;
import backend.ride_offer.enums.StatusOffer;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;

public class RideOfferSpecs {

    private RideOfferSpecs() {}

    public static Specification<RideOffer> withFilter(FilterRideOfferDto filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), StatusOffer.AVAILABLE));
            predicates.add(cb.greaterThanOrEqualTo(
                root.get("departureDateTime"), LocalDateTime.now()));

            if (filter.origin() != null) {
                predicates.add(cb.equal(root.get("origin"), filter.origin()));
            }

            if (filter.destination() != null) {
                predicates.add(cb.equal(root.get("destination"), filter.destination()));
            }

            if (filter.date() != null) {
                LocalDate day = filter.date();
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("departureDateTime"), day.atStartOfDay()));
                predicates.add(cb.lessThan(
                    root.get("departureDateTime"), day.plusDays(1).atStartOfDay()));
            }

            if (filter.period() != null) {
                int[] range = periodRange(filter.period());
                Expression<Integer> hour = cb.function(
                    "hour", Integer.class, root.get("departureDateTime"));
                predicates.add(cb.greaterThanOrEqualTo(hour, range[0]));
                predicates.add(cb.lessThan(hour, range[1]));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static int[] periodRange(Period period) {
        return switch (period) {
            case MORNING -> new int[] {5, 12};
            case AFTERNOON -> new int[] {12, 18};
            case EVENING -> new int[] {18, 24};
        };
    }
}