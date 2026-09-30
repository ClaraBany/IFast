package backend.ride_offer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.ride_offer.dto.CreateRideOfferDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.ride_offer.dto.FilterRideOfferDto;
import backend.user.User;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ride-offer")
public class RideOfferController {
    private final RideOfferService rideOfferService;

    public RideOfferController(RideOfferService rideOfferService) {
        this.rideOfferService = rideOfferService;
    }

    @PostMapping 
    public ResponseEntity<Void> create(@Valid @RequestBody CreateRideOfferDto rideOfferDto, @AuthenticationPrincipal User user) {
        rideOfferService.create(rideOfferDto, user);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

    // @PutMapping("/{rideOfferId}")
    // public ResponseEntity<RideOfferDto> update(@PathVariable Long rideOfferId, 
    //                                     @Valid @RequestBody CreateRideOfferDto rideOfferDto,
    //                                     @AuthenticationPrincipal User user
    //                                 ) {
    //     RideOfferDto response = rideOfferService.update(rideOfferId, rideOfferDto, user);
    //     return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    // }

    @GetMapping
    public ResponseEntity<List<RideOfferDto>> getAll(@Valid FilterRideOfferDto filterDto) {
        List<RideOfferDto> response = rideOfferService.getAll(filterDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{rideOfferId}")
    public ResponseEntity<RideOfferDto> get(@PathVariable Long rideOfferId) {
        RideOfferDto response = rideOfferService.get(rideOfferId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("cancel/{rideOfferId}")
    public ResponseEntity<RideOfferDto> cancel(@PathVariable Long rideOfferId, @AuthenticationPrincipal User user) {
        rideOfferService.cancel(rideOfferId, user);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}
