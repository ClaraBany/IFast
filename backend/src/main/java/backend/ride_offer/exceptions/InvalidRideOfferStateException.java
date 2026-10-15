package backend.ride_offer.exceptions;

public class InvalidRideOfferStateException extends RuntimeException {
    public InvalidRideOfferStateException() {
        super("Status da oferta inválido para a ação");
    }
}
