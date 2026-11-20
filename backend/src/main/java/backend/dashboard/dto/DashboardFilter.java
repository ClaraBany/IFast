package backend.dashboard.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.AssertTrue;

public record DashboardFilter(
        LocalDate startDate,
        LocalDate endDate
) {
    @AssertTrue(message = "A data final deve ser igual ou posterior à data inicial")
    public boolean isEndDateOnOrAfterStartDate() {
        return startDate == null || endDate == null || !endDate.isBefore(startDate);
    }
}