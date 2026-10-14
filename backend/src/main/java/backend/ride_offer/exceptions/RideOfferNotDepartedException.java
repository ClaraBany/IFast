package backend.ride_offer.exceptions;

public class RideOfferNotDepartedException extends RuntimeException {
    public RideOfferNotDepartedException() {
        super("A oferta só pode ser concluída após o horário de saída");
    }
}
