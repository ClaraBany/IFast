package backend.ride_booking.exceptions;

public class IncompatibleRideBookingException extends RuntimeException {
    public IncompatibleRideBookingException() {
        super("A oferta não está dentro do período de saída desejado pelo pedido");
    }
}
