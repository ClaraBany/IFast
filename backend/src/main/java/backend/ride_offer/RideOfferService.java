package backend.ride_offer;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import backend.notification.NotificationService;
import backend.ride_booking.RideBookingRepository;
import backend.ride_booking.enums.StatusBooking;
import backend.ride_request.RideRequestRepository;
import backend.shared.dto.IdCountDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.ride_offer.exceptions.InvalidSeatsCapacityException;
import backend.ride_booking.RideBookingService;
import backend.ride_offer.dto.CreateRideOfferDto;
import backend.shared.dto.FilterRideDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.shared.dto.IdResponseDto;
import backend.shared.enums.RideListStatus;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;

@AllArgsConstructor
@Service
public class RideOfferService {
    private final RideOfferRepository rideOfferRepository;
    private final RideBookingService rideBookingService;
    private final RideBookingRepository rideBookingRepository;
    private final RideRequestRepository rideRequestRepository;
    private final NotificationService notificationService;

    public List<RideOfferSummaryDto> getAll(FilterRideDto filter, User user) {
        return rideOfferRepository
            .findAll(RideOfferSpecs.withFilter(filter, user.getId()), Sort.by("departureDateTime").ascending())
            .stream()
            .map(RideOfferSummaryDto::new)
            .toList();
    }

    public List<RideOfferSummaryDto> getMyOffers(RideListStatus status, User user) {
        List<RideOffer> offers = status == RideListStatus.CLOSED
            ? rideOfferRepository.findClosedByDriver(user)
            : rideOfferRepository.findOpenByDriver(user);

        Map<Long, Long> pendingCounts = rideBookingRepository.countPendingByOfferForDriver(user)
            .stream()
            .collect(Collectors.toMap(IdCountDto::id, IdCountDto::count));

        return offers.stream()
            .map(offer -> {
                RideOfferSummaryDto dto = new RideOfferSummaryDto(offer);
                dto.setPendingBookingsCount(pendingCounts.getOrDefault(offer.getId(), 0L).intValue());
                return dto;
            })
            .toList();
    }

    public RideOfferDto get(Long rideOfferId) {
        RideOffer rideOffer = rideOfferRepository.findById(rideOfferId)
            .orElseThrow(EntityNotFoundException::new);

        return new RideOfferDto(rideOffer);
    }

    @Transactional
    public IdResponseDto create(CreateRideOfferDto rideOfferDto, User user) {
        validateOffer(rideOfferDto);

        RideOffer rideOffer = save(
            new RideOffer(),
            rideOfferDto,
            user,
            false
        );

        if (rideOfferDto.isRoundTrip()) {
            save(new RideOffer(), rideOfferDto, user, true);
        }

        List<User> matchingUsers = rideRequestRepository.findRequestersMatchingOffer(
            rideOfferDto.origin(),
            rideOfferDto.destination(),
            rideOfferDto.departureDateTime(),
            user
            );

        String message = "Surgiu uma carona que corresponde ao seu pedido do dia " +
            rideOffer.getDepartureDateTime().format(DateTimeFormatter.ofPattern("dd/MM"));
        notificationService.createForUsers("Nova Carona Disponível", message, rideOffer, matchingUsers);

        return new IdResponseDto(rideOffer.getId());
    }

    @Transactional
    public IdResponseDto update(Long rideOfferId, CreateRideOfferDto rideOfferDto, User user) {
        validateOffer(rideOfferDto);

        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.requireOpen();

        List<User> passengers = rideBookingRepository.findPassengersByRideOfferIdAndStatusIn(
            rideOfferId,
            List.of(StatusBooking.PENDING, StatusBooking.ACCEPTED)
        );
        String message = rideOffer.getDriver().getName() + " editou a oferta do dia " +
            rideOffer.getDepartureDateTime().format(DateTimeFormatter.ofPattern("dd/MM"));
        notificationService.createForUsers("Oferta Editada", message, rideOffer, passengers);

        return new IdResponseDto(save(rideOffer, rideOfferDto, user, false).getId());
    }

    @Transactional
    public void complete(Long rideOfferId, User user) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.complete();
        rideOfferRepository.save(rideOffer);
        rideBookingService.cancelPendingByOffer(rideOffer.getId());
    }

    @Transactional
    public void cancel(Long rideOfferId, User user) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.cancel();
        rideOfferRepository.save(rideOffer);
        rideBookingService.cancelPendingByOffer(rideOffer.getId());

        List<User> passengers = rideBookingRepository.findPassengersByRideOfferIdAndStatusIn(
            rideOfferId,
            List.of(StatusBooking.PENDING, StatusBooking.ACCEPTED)
        );
        String message = rideOffer.getDriver().getName() + " cancelou a oferta do dia " +
            rideOffer.getDepartureDateTime().format(DateTimeFormatter.ofPattern("dd/MM"));
        notificationService.createForUsers("Oferta Cancelada", message, rideOffer, passengers);
    }

    private void validateOffer(CreateRideOfferDto dto) {
        Integer vehicleCapacity = dto.vehicle().getCapacity();
        if (vehicleCapacity == null || dto.seatsCapacity() > vehicleCapacity) {
            throw new InvalidSeatsCapacityException();
        }
    }

    private RideOffer save(RideOffer offer, CreateRideOfferDto dto, User user, boolean isReturnTrip) {
        offer.changeCapacity(dto.seatsCapacity());
        offer.setDescription(dto.description());
        offer.setVehicle(dto.vehicle());
        offer.setDriver(user);

        if (isReturnTrip) {
            offer.setOrigin(dto.destination());
            offer.setDestination(dto.origin());
            offer.setDepartureDateTime(dto.returnDateTime());
        } else {
            offer.setOrigin(dto.origin());
            offer.setDestination(dto.destination());
            offer.setDepartureDateTime(dto.departureDateTime());
        }

        return rideOfferRepository.save(offer);
    }
}
