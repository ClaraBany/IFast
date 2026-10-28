package backend.ride_request;

import backend.shared.dto.FilterRideDto;
import backend.shared.dto.IdResponseDto;
import backend.ride_offer.exceptions.InvalidDepartureException;
import backend.ride_request.dto.CreateRideRequestDto;
import backend.ride_request.dto.RideRequestDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@Service
public class RideRequestService {
    private static final int MAX_DAYS_AHEAD = 7;

    private final RideRequestRepository rideRequestRepository;

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

    @Transactional
    public IdResponseDto create(CreateRideRequestDto dto, User user) {
        validateRequest(dto);

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
        validateRequest(dto);

        RideRequest request = rideRequestRepository.findByIdAndRequester(rideRequestId, user)
                .orElseThrow(EntityNotFoundException::new);

        request.setOrigin(dto.origin());
        request.setDestination(dto.destination());
        request.setDesiredDepartureStart(dto.desiredDepartureStart());
        request.setDesiredDepartureEnd(dto.desiredDepartureEnd());

        return new IdResponseDto(rideRequestRepository.save(request).getId());
    }

    @Transactional
    public void delete(Long rideRequestId, User user){
        RideRequest request = rideRequestRepository.findByIdAndRequester(rideRequestId, user)
                .orElseThrow(EntityNotFoundException::new);

        rideRequestRepository.delete(request);
    }

    private void validateRequest(CreateRideRequestDto dto) {
        LocalDateTime latestDeparture = LocalDateTime.now()
                .toLocalDate()
                .plusDays(MAX_DAYS_AHEAD)
                .atTime(LocalTime.MAX);

        if (dto.desiredDepartureStart().isAfter(latestDeparture) || dto.desiredDepartureEnd().isAfter(latestDeparture)) {
            throw new InvalidDepartureException();
        }
    }
}
