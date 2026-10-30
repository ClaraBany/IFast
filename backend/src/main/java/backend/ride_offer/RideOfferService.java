package backend.ride_offer;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.ride_offer.exceptions.InvalidRideOfferStateException;
import backend.ride_offer.exceptions.InvalidSeatsCapacityException;
import backend.ride_offer.exceptions.RideOfferNotDepartedException;
import backend.ride_offer.dto.CreateRideOfferDto;
import backend.shared.dto.FilterRideDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.ride_offer.enums.StatusOffer;
import backend.shared.dto.IdResponseDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;

@AllArgsConstructor
@Service
public class RideOfferService {
    private final RideOfferRepository rideOfferRepository;

    public List<RideOfferSummaryDto> getAll(FilterRideDto filter, User user) {
        return rideOfferRepository
            .findAll(RideOfferSpecs.withFilter(filter, user.getId()), Sort.by("departureDateTime").ascending())
            .stream()
            .map(RideOfferSummaryDto::new)
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

        return new IdResponseDto(rideOffer.getId());
    }

    @Transactional
    public IdResponseDto update(Long rideOfferId, CreateRideOfferDto rideOfferDto, User user) {
        validateOffer(rideOfferDto);

        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        if (rideOffer.getStatus() != StatusOffer.AVAILABLE) {
            throw new InvalidRideOfferStateException();
        }

        if (rideOfferDto.seatsCapacity() < rideOffer.getSeatsTaken()) {
            throw new InvalidSeatsCapacityException();
        }

        return new IdResponseDto(save(rideOffer, rideOfferDto, user, false).getId());
    }

    @Transactional
    public void complete(Long rideOfferId, User user) {
        transitionStatus(rideOfferId, user, StatusOffer.COMPLETED);
    }

    @Transactional
    public void cancel(Long rideOfferId, User user) {
        transitionStatus(rideOfferId, user, StatusOffer.CANCELLED);
    }

    private void validateOffer(CreateRideOfferDto dto) {
        Integer vehicleCapacity = dto.vehicle().getCapacity();
        if (vehicleCapacity == null || dto.seatsCapacity() > vehicleCapacity) {
            throw new InvalidSeatsCapacityException();
        }
    }

    private void transitionStatus(Long rideOfferId, User user, StatusOffer targetStatus) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        StatusOffer currentStatus = rideOffer.getStatus();
        if (currentStatus != StatusOffer.AVAILABLE && currentStatus != StatusOffer.FULL) {
            throw new InvalidRideOfferStateException();
        }

        if (targetStatus == StatusOffer.COMPLETED
            && !rideOffer.getDepartureDateTime().isBefore(LocalDateTime.now())) {
            throw new RideOfferNotDepartedException();
        }

        rideOffer.setStatus(targetStatus);
        rideOfferRepository.save(rideOffer);
    }

    private RideOffer save(RideOffer offer, CreateRideOfferDto dto, User user, boolean returnTrip) {
        offer.setSeatsCapacity(dto.seatsCapacity());
        offer.setDescription(dto.description());
        offer.setVehicle(dto.vehicle());
        offer.setStatus(StatusOffer.AVAILABLE);
        offer.setDriver(user);

        if (returnTrip) {
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
