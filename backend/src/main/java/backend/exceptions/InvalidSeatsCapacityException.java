package backend.exceptions;

public class InvalidSeatsCapacityException extends RuntimeException{
    public InvalidSeatsCapacityException() {
        super("A quantidade de vagas da oferta não pode ser maior que a capacidade do veículo");
    }
}
