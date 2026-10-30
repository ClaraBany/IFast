package backend.shared.validation;

import backend.shared.constants.RideConstants;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static backend.shared.constants.RideConstants.MAX_DAYS_AHEAD;

@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MaxDaysAhead.Validator.class)
@Documented
public @interface MaxDaysAhead {
    String message() default "A data não pode ultrapassar " + MAX_DAYS_AHEAD + " dias";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<MaxDaysAhead, LocalDateTime> {
        @Override
        public boolean isValid(LocalDateTime value, ConstraintValidatorContext context) {
            if (value == null) {
                return true;
            }

            LocalDateTime latestAllowed = LocalDateTime.now()
                    .toLocalDate()
                    .plusDays(RideConstants.MAX_DAYS_AHEAD)
                    .atTime(LocalTime.MAX);

            return !value.isAfter(latestAllowed);
        }
    }
}