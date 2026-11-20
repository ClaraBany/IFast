package backend.dashboard;

import backend.dashboard.dto.DashboardDto;
import backend.dashboard.dto.DashboardFilter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(@Valid DashboardFilter filter) {
        DashboardDto response = dashboardService.getDashboard(filter);
        return ResponseEntity.ok(response);
    }
}