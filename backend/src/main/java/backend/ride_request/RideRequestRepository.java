package backend.ride_request;

import backend.shared.enums.Neighborhoods;
import backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RideRequestRepository extends JpaRepository<RideRequest, Long>, JpaSpecificationExecutor<RideRequest> {
    Optional<RideRequest> findByIdAndRequester(Long Id, User requester);

    @Query("""
    select r from RideRequest r
    where r.requester = :requester
      and r.status in (backend.ride_request.enums.StatusRequest.CANCELLED, backend.ride_request.enums.StatusRequest.ACCEPTED)
    order by r.desiredDepartureStart asc
    """)
    List<RideRequest> findClosedByRequester(@Param("requester") User requester);

    @Query("""
    select r from RideRequest r
    where r.requester = :requester
      and r.status = backend.ride_request.enums.StatusRequest.PENDING
    order by r.desiredDepartureStart asc
    """)
    List<RideRequest> findOpenByRequester(@Param("requester") User requester);

    @Query("""
    select distinct r.requester from RideRequest r
    where r.status = backend.ride_request.enums.StatusRequest.PENDING
      and r.origin = :origin
      and r.destination = :destination
      and :departure between r.desiredDepartureStart and r.desiredDepartureEnd
      and r.requester <> :driver
    """)
    List<User> findRequestersMatchingOffer(
            @Param("origin") Neighborhoods origin,
            @Param("destination") Neighborhoods destination,
            @Param("departure") LocalDateTime departure,
            @Param("driver") User driver);
}
