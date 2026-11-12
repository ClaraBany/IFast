package backend.ride_request;

import backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
