package backend.ride_offer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import backend.shared.enums.Neighborhoods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import backend.user.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RideOfferRepository extends JpaRepository<RideOffer, Long>, JpaSpecificationExecutor<RideOffer>{
    Optional<RideOffer> findByIdAndDriver(Long Id, User driver);

    @Query("""
    select o from RideOffer o
    where o.status = backend.ride_offer.enums.StatusOffer.AVAILABLE
      and o.departureDateTime >= :now
      and o.departureDateTime between :windowStart and :windowEnd
      and o.origin = :origin
      and o.destination = :destination
      and o.driver <> :requester
    order by o.departureDateTime asc
    """)
    List<RideOffer> findMatching(
            @Param("origin") Neighborhoods origin,
            @Param("destination") Neighborhoods destination,
            @Param("windowStart") LocalDateTime windowStart,
            @Param("windowEnd") LocalDateTime windowEnd,
            @Param("requester") User requester,
            @Param("now") LocalDateTime now);
} 
