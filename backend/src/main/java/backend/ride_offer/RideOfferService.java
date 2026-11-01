package backend.ride_offer;

import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.ride_offer.exceptions.InvalidSeatsCapacityException;
import backend.ride_offer.dto.CreateRideOfferDto;
import backend.shared.dto.FilterRideDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.ride_offer.dto.RideOfferSummaryDto;
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

        rideOffer.requireOpen();

        return new IdResponseDto(save(rideOffer, rideOfferDto, user, false).getId());
    }

    @Transactional
    public void complete(Long rideOfferId, User user) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.complete();
        rideOfferRepository.save(rideOffer);
    }

    @Transactional
    public void cancel(Long rideOfferId, User user) {
        RideOffer rideOffer = rideOfferRepository.findByIdAndDriver(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.cancel();
        rideOfferRepository.save(rideOffer);
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
