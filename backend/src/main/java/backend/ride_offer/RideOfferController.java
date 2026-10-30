package backend.ride_offer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.ride_offer.dto.CreateRideOfferDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.shared.dto.FilterRideDto;
import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.user.User;
import backend.shared.dto.IdResponseDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ride-offers")
public class RideOfferController {
    private final RideOfferService rideOfferService;

    public RideOfferController(RideOfferService rideOfferService) {
        this.rideOfferService = rideOfferService;
    }

    @GetMapping
    public ResponseEntity<List<RideOfferSummaryDto>> getAll(@Valid FilterRideDto filterDto) {
        List<RideOfferSummaryDto> response = rideOfferService.getAll(filterDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{rideOfferId}")
    public ResponseEntity<RideOfferDto> get(@PathVariable Long rideOfferId) {
        RideOfferDto response = rideOfferService.get(rideOfferId);
        return ResponseEntity.ok(response);
    }

    @PostMapping 
    public ResponseEntity<IdResponseDto> create(@Valid @RequestBody CreateRideOfferDto rideOfferDto, @AuthenticationPrincipal User user) {
        IdResponseDto response = rideOfferService.create(rideOfferDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{rideOfferId}")
    public ResponseEntity<IdResponseDto> update(@PathVariable Long rideOfferId, 
                                        @Valid @RequestBody CreateRideOfferDto rideOfferDto,
                                        @AuthenticationPrincipal User user
                                    ) {
        IdResponseDto response = rideOfferService.update(rideOfferId, rideOfferDto, user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{rideOfferId}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long rideOfferId, @AuthenticationPrincipal User user) {
        rideOfferService.complete(rideOfferId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{rideOfferId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long rideOfferId, @AuthenticationPrincipal User user) {
        rideOfferService.cancel(rideOfferId, user);
        return ResponseEntity.noContent().build();
    }
}
