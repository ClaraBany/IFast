package backend.dashboard.dto;

import java.util.List;

public record DashboardDto(
        long openRequests,
        long openRides,
        long registeredUsers,
        long completedRides,
        long cancelledRides,
        List<DashboardPointDto> ridesByNeighboors,
        List<DashboardPointDto> ridesByPeriod,
        List<DashboardPointDto> ridesByWeekdays
) {}