package backend.dashboard;

import backend.dashboard.dto.DashboardDto;
import backend.dashboard.dto.DashboardFilter;
import backend.dashboard.dto.DashboardPointDto;
import backend.ride_offer.RideOffer;
import backend.ride_offer.RideOfferRepository;
import backend.ride_offer.enums.StatusOffer;
import backend.ride_request.RideRequestRepository;
import backend.ride_request.enums.StatusRequest;
import backend.shared.enums.Period;
import backend.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class DashboardService {
    private final RideOfferRepository rideOfferRepository;
    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;

    public DashboardDto getDashboard(DashboardFilter filter) {
        LocalDateTime startDate = filter.startDate() == null ? null : filter.startDate().atStartOfDay();
        LocalDateTime endDateExclusive = filter.endDate() == null
                ? null
                : filter.endDate().plusDays(1).atStartOfDay();
        long openRequests = rideRequestRepository.countByStatus(StatusRequest.PENDING);
        long openRides = rideOfferRepository.countByStatusIn(List.of(StatusOffer.AVAILABLE, StatusOffer.FULL));
        long registeredUsers = userRepository.countByCreatedAtDateRange(startDate, endDateExclusive);
        long completedRides = rideOfferRepository.countByStatusAndDateRange(StatusOffer.COMPLETED, startDate, endDateExclusive);
        long cancelledRides = rideOfferRepository.countByStatusAndDateRange(StatusOffer.CANCELLED, startDate, endDateExclusive);
        List<RideOffer> rides = rideOfferRepository.findByDateRange(startDate, endDateExclusive);

        return new DashboardDto(
                openRequests,
                openRides,
                registeredUsers,
                completedRides,
                cancelledRides,
                countByNeighborhood(rides),
                countByPeriod(rides),
                countByWeekday(rides)
        );
    }

    private List<DashboardPointDto> countByNeighborhood(List<RideOffer> rides) {
        return rides.stream()
                .collect(Collectors.groupingBy(ride -> ride.getOrigin().name(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new DashboardPointDto(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<DashboardPointDto> countByPeriod(List<RideOffer> rides) {
        return rides.stream()
                .map(ride -> Period.periodForHour(ride.getDepartureDateTime().getHour()))
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.groupingBy(
                        period -> period,
                        Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new DashboardPointDto(entry.getKey().name(), entry.getValue()))
                .toList();
    }

    private List<DashboardPointDto> countByWeekday(List<RideOffer> rides) {
        return rides.stream()
                .collect(Collectors.groupingBy(
                        ride -> ride.getDepartureDateTime().getDayOfWeek(),
                        Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new DashboardPointDto(entry.getKey().name(), entry.getValue()))
                .toList();
    }
}