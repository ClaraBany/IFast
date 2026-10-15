package backend.ride_offer.exceptions;

public class InvalidSeatsCapacityException extends RuntimeException{
    public InvalidSeatsCapacityException() {
        super("A quantidade de vagas não pode ser menor que as vagas ocupadas nem maior que a capacidade do veículo");
    }
}
