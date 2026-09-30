package backend.ride_offer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import backend.user.User;

public interface RideOfferRepository extends JpaRepository<RideOffer, Long>, JpaSpecificationExecutor<RideOffer>{

    Optional<RideOffer> findByIdAndUser(Long Id, User user);                                   
} 
