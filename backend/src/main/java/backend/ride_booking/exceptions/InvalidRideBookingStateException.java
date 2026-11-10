package backend.ride_booking.exceptions;

public class InvalidRideBookingStateException extends RuntimeException {
    public InvalidRideBookingStateException() {
        super("A reserva não está pendente e não pode ter o status alterado");
    }
}
