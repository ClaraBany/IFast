package backend.vehicle;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.auth.User;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }
    
    @PostMapping
    public ResponseEntity<VehicleDto> create(@Valid @RequestBody VehicleDto vehicleDto, @AuthenticationPrincipal User user) {
        VehicleDto response = vehicleService.create(vehicleDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VehicleDto>> getAll(@AuthenticationPrincipal User user) {
        List<VehicleDto> response = vehicleService.getAll(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vehicleId}") 
    public ResponseEntity<VehicleDto> get(@PathVariable Long vehicleId, @AuthenticationPrincipal User user) {
        VehicleDto response = vehicleService.get(vehicleId, user);
        return ResponseEntity.ok(response);
    }
}
