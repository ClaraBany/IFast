package backend.ride_booking.exceptions;

public class DuplicateRideBookingException extends RuntimeException {
    public DuplicateRideBookingException() {
        super("Este passageiro já possui uma reserva para esta oferta");
    }
}
