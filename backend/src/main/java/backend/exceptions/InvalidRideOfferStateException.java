package backend.exceptions;

public class InvalidRideOfferStateException extends RuntimeException {
    public InvalidRideOfferStateException() {
        super("Status da oferta inválido para a ação");
    }
}
