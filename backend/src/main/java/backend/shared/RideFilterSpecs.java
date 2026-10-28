package backend.shared;

import java.time.LocalDate;

import backend.shared.enums.Neighborhoods;
import backend.shared.enums.Period;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Expression;

public final class RideFilterSpecs {

    private RideFilterSpecs() {}

    public static <T> Specification<T> hasOrigin(Neighborhoods origin) {
        return (root, query, cb) ->
            origin == null ? null : cb.equal(root.get("origin"), origin);
    }

    public static <T> Specification<T> hasDestination(Neighborhoods destination) {
        return (root, query, cb) ->
            destination == null ? null : cb.equal(root.get("destination"), destination);
    }

    public static <T> Specification<T> onDay(LocalDate day, String dateTimeField) {
        return (root, query, cb) -> {
            if (day == null) return null;
            return cb.and(
                cb.greaterThanOrEqualTo(root.get(dateTimeField), day.atStartOfDay()),
                cb.lessThan(root.get(dateTimeField), day.plusDays(1).atStartOfDay()));
        };
    }

    public static <T> Specification<T> inPeriod(Period period, String dateTimeField) {
        return (root, query, cb) -> {
            if (period == null) return null;
            Expression<Integer> hour =
                    cb.function("hour", Integer.class, root.get(dateTimeField));
            return cb.and(
                    cb.greaterThanOrEqualTo(hour, period.getStartHour()),
                    cb.lessThan(hour, period.getEndHour()));
        };
    }
}
