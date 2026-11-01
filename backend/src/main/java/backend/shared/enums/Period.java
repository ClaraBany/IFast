package backend.shared.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Period {
    MORNING(5, 12),
    AFTERNOON(12, 18),
    EVENING(18, 24);

    private final int startHour;
    private final int endHour;
}
