package backend.ride_booking;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import backend.shared.dto.IdCountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.ride_booking.enums.StatusBooking;
import backend.ride_offer.RideOffer;
import backend.ride_request.RideRequest;
import backend.user.User;

public interface RideBookingRepository extends JpaRepository<RideBooking, Long>{
    Optional<RideBooking> findById(Long bookingId);
    List<RideBooking> findByRideOffer(RideOffer rideOffer);
    List<RideBooking> findByRideOfferAndStatus(RideOffer rideOffer, StatusBooking status);
    List<RideBooking> findByRideRequest(RideRequest rideRequest);
    List<RideBooking> findByRideRequestAndStatus(RideRequest rideRequest, StatusBooking status);
    List<RideBooking> findByRideOfferIdAndStatusIn(Long rideOfferId, Collection<StatusBooking> status);
    List<RideBooking> findByRideOfferAndStatusNot(RideOffer rideOffer, StatusBooking status);
    boolean existsByPassengerAndRideOfferAndStatusIn(
        User passenger,
        RideOffer rideOffer,
        Collection<StatusBooking> statuses
    );

    @Query("""
    select distinct p from RideBooking b
    join b.passenger p
    where b.rideOffer.id = :rideOfferId
      and b.status in :statuses
    """)
    List<User> findPassengersByRideOfferIdAndStatusIn(
            @Param("rideOfferId") Long rideOfferId,
            @Param("statuses") Collection<StatusBooking> statuses
    );

    @Query("""
    select count(b) from RideBooking b
    where b.passenger = :passenger
      and b.status = backend.ride_booking.enums.StatusBooking.ACCEPTED
      and b.rideOffer.status = backend.ride_offer.enums.StatusOffer.COMPLETED
    """)
    long countCompletedRidesByPassenger(@Param("passenger") User passenger);

    @Query("""
    select new backend.shared.dto.IdCountDto(b.rideOffer.id, count(b))
    from RideBooking b
    where b.rideOffer.driver = :driver
      and b.status = backend.ride_booking.enums.StatusBooking.PENDING
      and b.initiatedBy = backend.ride_booking.enums.InitiatedBy.PASSENGER
    group by b.rideOffer.id
    """)
    List<IdCountDto> countPendingByOfferForDriver(@Param("driver") User driver);

    @Query("""
    select new backend.shared.dto.IdCountDto(b.rideRequest.id, count(b))
    from RideBooking b
    where b.rideRequest.requester = :requester
      and b.status = backend.ride_booking.enums.StatusBooking.PENDING
    group by b.rideRequest.id
    """)
    List<IdCountDto> countPendingByRequestForRequester(@Param("requester") User requester);

    @Query("""
    select distinct b.rideRequest.id from RideBooking b
    where b.rideOffer.driver = :driver
      and b.rideRequest.status = backend.ride_request.enums.StatusRequest.PENDING
      and b.status = backend.ride_booking.enums.StatusBooking.PENDING
    """)
    Set<Long> findPendingBookedRideRequestIdsByDriver(@Param("driver") User driver);

    @Query("""
    select b from RideBooking b
    where b.passenger = :passenger
        and b.status = backend.ride_booking.enums.StatusBooking.ACCEPTED
        and b.rideOffer.status in (
            backend.ride_offer.enums.StatusOffer.COMPLETED,
            backend.ride_offer.enums.StatusOffer.CANCELLED
        )
    order by b.rideOffer.departureDateTime asc
    """)
    List<RideBooking> findClosedByPassenger(@Param("passenger") User passenger);

    @Query("""
    select b from RideBooking b
    where b.passenger = :passenger
      and (
        b.status = backend.ride_booking.enums.StatusBooking.PENDING
        or (
          b.status = backend.ride_booking.enums.StatusBooking.ACCEPTED
          and b.rideOffer.status not in (
              backend.ride_offer.enums.StatusOffer.COMPLETED,
              backend.ride_offer.enums.StatusOffer.CANCELLED
          )
        )
      )
    order by b.rideOffer.departureDateTime asc
    """)
    List<RideBooking> findOpenByPassenger(@Param("passenger") User passenger);
}
