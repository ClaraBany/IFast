package backend.ride_request;

import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.shared.dto.FilterRideDto;
import backend.shared.dto.IdResponseDto;
import backend.ride_request.dto.CreateRideRequestDto;
import backend.ride_request.dto.RideRequestDto;
import backend.user.User;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/ride-requests")
public class RideRequestController {
    private final RideRequestService rideRequestService;

    @GetMapping
    public ResponseEntity<List<RideRequestDto>> getAll(@Valid FilterRideDto filterDto) {
        List<RideRequestDto> response = rideRequestService.getAll(filterDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{rideRequestId}")
    public ResponseEntity<RideRequestDto> get(@PathVariable Long rideRequestId) {
        RideRequestDto response = rideRequestService.get(rideRequestId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{rideRequestId}/matching-offers")
    public ResponseEntity<List<RideOfferSummaryDto>> getMatchingOffers(@PathVariable Long rideRequestId) {
        List<RideOfferSummaryDto> response = rideRequestService.getMatchingOffers(rideRequestId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<IdResponseDto> create(@Valid @RequestBody CreateRideRequestDto dto,
                                                @AuthenticationPrincipal User user) {
        IdResponseDto response = rideRequestService.create(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{rideRequestId}")
    public ResponseEntity<IdResponseDto> update(@PathVariable Long rideRequestId,
                                                @Valid @RequestBody CreateRideRequestDto dto,
                                                @AuthenticationPrincipal User user
    ) {
        IdResponseDto response = rideRequestService.update(rideRequestId, dto, user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{rideRequestId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long rideRequestId, @AuthenticationPrincipal User user) {
        rideRequestService.cancel(rideRequestId, user);
        return ResponseEntity.noContent().build();
    }
}
