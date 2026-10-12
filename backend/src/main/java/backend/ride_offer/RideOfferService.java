package backend.ride_offer;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.exceptions.InvalidDepartureException;
import backend.exceptions.InvalidRideOfferStateException;
import backend.exceptions.InvalidSeatsCapacityException;
import backend.ride_offer.dto.CreateRideOfferDto;
import backend.ride_offer.dto.FilterRideOfferDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;

@Service
public class RideOfferService {
    private static final int MAX_DAYS_AHEAD = 7;

    private final RideOfferRepository rideOfferRepository;

    public RideOfferService(RideOfferRepository rideOfferRepository) {
        this.rideOfferRepository = rideOfferRepository;
    }

    @Transactional
    public void create(CreateRideOfferDto rideOfferDto, User user) {
        validateOffer(rideOfferDto);

        save(
            new RideOffer(),
            rideOfferDto,
            user,
            false
        );

        if (rideOfferDto.roundTrip()) {
            save(new RideOffer(), rideOfferDto, user, true);
        }
    }

    public RideOfferDto get(Long rideOfferId) {
        RideOffer rideOffer = rideOfferRepository.findById(rideOfferId)
            .orElseThrow(EntityNotFoundException::new);

        return new RideOfferDto(rideOffer);
    }

    public List<RideOfferDto> getAll(FilterRideOfferDto filter) {
        return rideOfferRepository
            .findAll(RideOfferSpecs.withFilter(filter), Sort.by("departureDateTime").ascending())
            .stream()
            .map(RideOfferDto::new)
            .toList();
    }

    @Transactional
    public void cancel(Long rideOfferId, User user) {
        transitionStatus(rideOfferId, user, StatusOffer.CANCELLED);
    }

    @Transactional
    public void complete(Long rideOfferId, User user) {
        transitionStatus(rideOfferId, user, StatusOffer.COMPLETED);
    }

    @Transactional
    public void update(Long rideOfferId, CreateRideOfferDto rideOfferDto, User user) {
        validateOffer(rideOfferDto);

        RideOffer rideOffer = rideOfferRepository.findByIdAndUser(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        if (rideOffer.getStatus() != StatusOffer.AVAILABLE) {
            throw new InvalidRideOfferStateException();
        }

        save(rideOffer, rideOfferDto, user, false);
    }

    private void validateOffer(CreateRideOfferDto dto) {
        Integer vehicleCapacity = dto.vehicle().getCapacity();
        if (vehicleCapacity == null || dto.seatsCapacity() > vehicleCapacity) {
            throw new InvalidSeatsCapacityException();
        }

        LocalDateTime latestDeparture = LocalDateTime.now().plusDays(MAX_DAYS_AHEAD);
        if (dto.departureDateTime().isAfter(latestDeparture)
            || (dto.roundTrip() && dto.returnDateTime().isAfter(latestDeparture))) {
            throw new InvalidDepartureException();
        }
    }

    private void transitionStatus(Long rideOfferId, User user, StatusOffer targetStatus) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndUser(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        StatusOffer currentStatus = rideOffer.getStatus();
        if (currentStatus != StatusOffer.AVAILABLE && currentStatus != StatusOffer.FULL) {
            throw new InvalidRideOfferStateException();
        }

        rideOffer.setStatus(targetStatus);
        rideOfferRepository.save(rideOffer);
    }

    private void save(RideOffer offer, CreateRideOfferDto dto, User user, boolean returnTrip) {
        offer.setSeats_capacity(dto.seatsCapacity());
        offer.setDescription(dto.description());
        offer.setVehicle(dto.vehicle());
        offer.setStatus(StatusOffer.AVAILABLE);
        offer.setUser(user);

        if (returnTrip) {
            offer.setOrigin(dto.destination());
            offer.setDestination(dto.origin());
            offer.setDepartureDateTime(dto.returnDateTime());
        } else {
            offer.setOrigin(dto.origin());
            offer.setDestination(dto.destination());
            offer.setDepartureDateTime(dto.departureDateTime());
        }

        rideOfferRepository.save(offer);
    }
}
