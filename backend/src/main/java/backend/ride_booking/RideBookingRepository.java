package backend.ride_booking;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.ride_booking.enums.StatusBooking;
import backend.ride_offer.enums.StatusOffer;
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
    boolean existsByPassengerAndRideOffer(User passenger, RideOffer rideOffer);

    @Query("""
    select count(b) from RideBooking b
    where b.passenger = :passenger
      and b.status = backend.ride_booking.enums.StatusBooking.ACCEPTED
      and b.rideOffer.status = backend.ride_offer.enums.StatusOffer.COMPLETED
    """)
    long countCompletedRidesByPassenger(@Param("passenger") User passenger);

    @Query("""
    select b from RideBooking b
    where b.passenger = :passenger
      and b.status <> backend.ride_booking.enums.StatusBooking.PENDING
      and (
        b.status <> backend.ride_booking.enums.StatusBooking.ACCEPTED
        or b.rideOffer.status = backend.ride_offer.enums.StatusOffer.COMPLETED
      )
    order by b.rideOffer.departureDateTime asc
    """)
    List<RideBooking> findCompletedByPassenger(@Param("passenger") User passenger);

    @Query("""
    select b from RideBooking b
    where b.passenger = :passenger
      and (
        b.status = backend.ride_booking.enums.StatusBooking.PENDING
        or (
          b.status = backend.ride_booking.enums.StatusBooking.ACCEPTED
          and b.rideOffer.status <> backend.ride_offer.enums.StatusOffer.COMPLETED
        )
      )
    order by b.rideOffer.departureDateTime asc
    """)
    List<RideBooking> findOpenByPassenger(@Param("passenger") User passenger);
}
