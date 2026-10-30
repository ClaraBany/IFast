package backend.ride_request;

import backend.ride_offer.RideOfferRepository;
import backend.ride_offer.dto.RideOfferSummaryDto;
import backend.shared.dto.FilterRideDto;
import backend.shared.dto.IdResponseDto;
import backend.ride_request.dto.CreateRideRequestDto;
import backend.ride_request.dto.RideRequestDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class RideRequestService {
    private final RideRequestRepository rideRequestRepository;
    private final RideOfferRepository rideOfferRepository;

    public List<RideRequestDto> getAll(FilterRideDto filter) {
        return rideRequestRepository
            .findAll(RideRequestSpecs.withFilter(filter), Sort.by("desiredDepartureStart").ascending())
            .stream()
            .map(RideRequestDto::new)
            .toList();
    }

    public RideRequestDto get(Long rideRequestId) {
        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
            .orElseThrow(EntityNotFoundException::new);

        return new RideRequestDto(rideRequest);
    }

    public List<RideOfferSummaryDto> getMatchingOffers(Long rideRequestId) {
        RideRequest request = rideRequestRepository.findById(rideRequestId)
            .orElseThrow(EntityNotFoundException::new);

        return rideOfferRepository
            .findMatching(
                request.getOrigin(),
                request.getDestination(),
                request.getDesiredDepartureStart(),
                request.getDesiredDepartureEnd(),
                request.getRequester(),
                LocalDateTime.now()
            )
            .stream()
            .map(RideOfferSummaryDto::new)
            .toList();
    }

    @Transactional
    public IdResponseDto create(CreateRideRequestDto dto, User user) {
        RideRequest request = new RideRequest();

        request.setRequester(user);
        request.setOrigin(dto.origin());
        request.setDestination(dto.destination());
        request.setDesiredDepartureStart(dto.desiredDepartureStart());
        request.setDesiredDepartureEnd(dto.desiredDepartureEnd());

        return new IdResponseDto(rideRequestRepository.save(request).getId());
    }

    @Transactional
    public IdResponseDto update(Long rideRequestId, CreateRideRequestDto dto, User user) {
        RideRequest request = rideRequestRepository.findByIdAndRequester(rideRequestId, user)
            .orElseThrow(EntityNotFoundException::new);

        request.requireOpen();

        request.setOrigin(dto.origin());
        request.setDestination(dto.destination());
        request.setDesiredDepartureStart(dto.desiredDepartureStart());
        request.setDesiredDepartureEnd(dto.desiredDepartureEnd());

        return new IdResponseDto(rideRequestRepository.save(request).getId());
    }

    @Transactional
    public void cancel(Long rideRequestId, User user) {
        RideRequest request = rideRequestRepository.findByIdAndRequester(rideRequestId, user)
            .orElseThrow(EntityNotFoundException::new);

        request.cancel();
        rideRequestRepository.save(request);
    }
}
