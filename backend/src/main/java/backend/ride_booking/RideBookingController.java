package backend.ride_booking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import backend.ride_booking.dto.CreateRideBookingForRequestDto;
import backend.ride_booking.dto.RideBookingDto;
import backend.ride_booking.enums.StatusBooking;
import backend.shared.dto.IdResponseDto;
import backend.shared.enums.RideListStatus;
import backend.user.User;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor 
@RestController
public class RideBookingController {
    private final RideBookingService rideBookingService;

    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<List<RideBookingDto>> getMyBookings(@RequestParam RideListStatus status,
                                                              @AuthenticationPrincipal User user) {
        List<RideBookingDto> response = rideBookingService.getMyBookings(status, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ride-offers/{rideOfferId}/bookings")
    public ResponseEntity<List<RideBookingDto>> getByOffer(@PathVariable Long rideOfferId, 
                                                            @RequestParam(required = false) StatusBooking status,
                                                            @AuthenticationPrincipal User user) {
        List<RideBookingDto> response = rideBookingService.getForOffer(rideOfferId, status, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ride-requests/{rideRequestId}/bookings")
    public ResponseEntity<List<RideBookingDto>> getByRequest(@PathVariable Long rideRequestId, 
                                                            @RequestParam(required = false) StatusBooking status,
                                                            @AuthenticationPrincipal User user) {
        List<RideBookingDto> response = rideBookingService.getForRequest(rideRequestId, status, user);
        return ResponseEntity.ok(response);
    } //tirar status 

    @PostMapping("/ride-offers/{rideOfferId}/bookings")
    public ResponseEntity<IdResponseDto> createForOffer(@PathVariable Long rideOfferId, @AuthenticationPrincipal User user) {
        IdResponseDto response = rideBookingService.createForOffer(rideOfferId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/ride-requests/{rideRequestId}/bookings")
    public ResponseEntity<IdResponseDto> createForRequest(@PathVariable Long rideRequestId, 
                                                        @Valid @RequestBody CreateRideBookingForRequestDto rideBookingForRequestDto, 
                                                        @AuthenticationPrincipal User user) {
        IdResponseDto response = rideBookingService.createForRequest(rideRequestId, rideBookingForRequestDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<Void> accept(@PathVariable Long bookingId, @AuthenticationPrincipal User user) {
        rideBookingService.accept(bookingId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long bookingId, @AuthenticationPrincipal User user) {
        rideBookingService.reject(bookingId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long bookingId, @AuthenticationPrincipal User user) {
        rideBookingService.cancel(bookingId, user);
        return ResponseEntity.noContent().build();
    }
}