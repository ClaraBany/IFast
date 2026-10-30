package backend.ride_request.exceptions;

public class InvalidRideRequestStateException extends RuntimeException {
    public InvalidRideRequestStateException() {
        super("Status de pedido inválido para a ação");
    }
}
