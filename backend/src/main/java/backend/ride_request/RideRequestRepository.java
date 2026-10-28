package backend.ride_request;

import backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface RideRequestRepository extends JpaRepository<RideRequest, Long>, JpaSpecificationExecutor<RideRequest> {
    Optional<RideRequest> findByIdAndRequester(Long Id, User requester);
}
