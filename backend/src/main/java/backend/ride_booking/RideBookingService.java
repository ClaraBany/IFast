package backend.ride_booking;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import backend.ride_booking.dto.CreateRideBookingForRequestDto;
import backend.ride_booking.dto.RideBookingDto;
import backend.ride_booking.enums.InitiatedBy;
import backend.ride_booking.enums.StatusBooking;
import backend.ride_booking.exceptions.DuplicateRideBookingException;
import backend.ride_booking.exceptions.InvalidRideBookingStateException;
import backend.ride_offer.RideOffer;
import backend.ride_offer.RideOfferRepository;
import backend.ride_offer.enums.StatusOffer;
import backend.shared.enums.RideListStatus;
import backend.ride_offer.exceptions.InvalidRideOfferStateException;
import backend.ride_request.RideRequest;
import backend.ride_request.RideRequestRepository;
import backend.shared.dto.IdResponseDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service 
@AllArgsConstructor 
public class RideBookingService {
    private final RideBookingRepository rideBookingRepository;
    private final RideOfferRepository rideOfferRepository;
    private final RideRequestRepository rideRequestRepository;

    public List<RideBookingDto> getMyBookings(RideListStatus status, User user) {
        List<RideBooking> bookings = status == RideListStatus.COMPLETED
            ? rideBookingRepository.findCompletedByPassenger(user)
            : rideBookingRepository.findOpenByPassenger(user);

        return bookings.stream().map(RideBookingDto::new).toList();
    }

    public List<RideBookingDto> getForOffer(Long rideOfferId, StatusBooking status, User user) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        List<RideBooking> bookings = status == null
            ? rideBookingRepository.findByRideOffer(rideOffer)
            : rideBookingRepository.findByRideOfferAndStatus(rideOffer, status);

        return bookings
            .stream()
            .map(RideBookingDto::new)
            .toList();
    }

    public List<RideBookingDto> getForRequest(Long rideRequestId, StatusBooking status, User user) {
        RideRequest rideRequest = rideRequestRepository.findByIdAndRequester(rideRequestId, user)
            .orElseThrow(EntityNotFoundException::new);

        List<RideBooking> bookings = status == null
            ? rideBookingRepository.findByRideRequest(rideRequest)
            : rideBookingRepository.findByRideRequestAndStatus(rideRequest, status);

        return bookings
            .stream()
            .map(RideBookingDto::new)
            .toList();
    } 

    @Transactional
    public IdResponseDto createForOffer(Long rideOfferId, User user) {
        RideOffer rideOffer = rideOfferRepository.findById(rideOfferId)
            .orElseThrow(EntityNotFoundException::new);

        if(rideOffer.getStatus() != StatusOffer.AVAILABLE){ 
            throw new InvalidRideOfferStateException();
        }
        ensureNoExistingBooking(user, rideOffer);

        RideBooking rideBooking = new RideBooking();
        rideBooking.setPassenger(user);
        rideBooking.setRideOffer(rideOffer);
        rideBooking.setInitiatedBy(InitiatedBy.PASSENGER);

        rideBookingRepository.save(rideBooking);

        return new IdResponseDto(rideBooking.getId());
    }

    @Transactional 
    public IdResponseDto createForRequest(Long rideRequestId, CreateRideBookingForRequestDto dto, User user) {
        RideOffer rideOffer = rideOfferRepository.findById(dto.rideOfferId())
            .orElseThrow(EntityNotFoundException::new);

        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
            .orElseThrow(EntityNotFoundException::new);
        rideRequest.requireOpen();

        if(rideOffer.getStatus() != StatusOffer.AVAILABLE){ 
            throw new InvalidRideOfferStateException();
        }
        ensureCompatible(rideRequest, rideOffer);
        ensureNoExistingBooking(rideRequest.getRequester(), rideOffer);

        RideBooking rideBooking = new RideBooking();
        rideBooking.setPassenger(rideRequest.getRequester());
        rideBooking.setRideOffer(rideOffer);
        rideBooking.setRideRequest(rideRequest);
        rideBooking.setInitiatedBy(InitiatedBy.DRIVER);

        rideBookingRepository.save(rideBooking);

        return new IdResponseDto(rideBooking.getId());
    }

    @Transactional
    public void accept(Long bookingId, User user) {
        RideBooking rideBooking = getPendingBookingForAuthorizedUser(bookingId, user);
        RideOffer rideOffer = rideBooking.getRideOffer();

        rideOffer.occupySeat();
        rideBooking.accept();

        if (rideBooking.getRideRequest() != null) {
            rideBooking.getRideRequest().accept();
        }
    }

    @Transactional 
    public void reject(Long bookingId, User user) {
        RideBooking rideBooking = getPendingBookingForAuthorizedUser(bookingId, user);
        rideBooking.reject();
    }

    @Transactional
    public void cancel(Long bookingId, User user) {
        RideBooking booking = rideBookingRepository.findById(bookingId)
            .orElseThrow(EntityNotFoundException::new);

        if (!booking.getPassenger().getId().equals(user.getId())) {
            throw new AccessDeniedException("Você não pode cancelar esta reserva");
        }

        RideOffer offer = booking.getRideOffer();

        boolean hadSeat = booking.getStatus() == StatusBooking.ACCEPTED;
        booking.cancel();
        if (hadSeat) offer.releaseSeat();
    }

    @Transactional
    public void cancelAllByOffer(Long rideOfferId) {
        rideBookingRepository
            .findByRideOfferIdAndStatusIn(rideOfferId, List.of(StatusBooking.PENDING, StatusBooking.ACCEPTED))
            .forEach(RideBooking::cancel);
    }

    @Transactional
    public void cancelPendingByOffer(Long rideOfferId) {
        rideBookingRepository
            .findByRideOfferIdAndStatusIn(rideOfferId, List.of(StatusBooking.PENDING))
            .forEach(RideBooking::cancel);
    }

    private RideBooking getPendingBookingForAuthorizedUser(Long bookingId, User user) {
        RideBooking rideBooking = rideBookingRepository.findById(bookingId)
            .orElseThrow(EntityNotFoundException::new);

        if (rideBooking.getStatus() != StatusBooking.PENDING) {
            throw new InvalidRideBookingStateException();
        }

        if (!isAuthorized(rideBooking, user)) {
            throw new AccessDeniedException("Usuário não pode alterar esta reserva");
        }

        return rideBooking;
    }

    private void ensureNoExistingBooking(User passenger, RideOffer rideOffer) {
        if (rideBookingRepository.existsByPassengerAndRideOffer(passenger, rideOffer)) {
            throw new DuplicateRideBookingException();
        }
    }

    private void ensureCompatible(RideRequest rideRequest, RideOffer rideOffer) {
        if (rideOffer.getDepartureDateTime().isBefore(rideRequest.getDesiredDepartureStart())
            || rideOffer.getDepartureDateTime().isAfter(rideRequest.getDesiredDepartureEnd())) {
            throw new IncompatibleRideBookingException();
        }
    }

    private boolean isAuthorized(RideBooking rideBooking, User user) {
        return switch (rideBooking.getInitiatedBy()) {
            case DRIVER -> rideBooking.getPassenger().getId().equals(user.getId());
            case PASSENGER -> rideBooking.getRideOffer().getDriver().getId().equals(user.getId());
        };
    }
}
