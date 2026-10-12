package backend.exceptions;

public class InvalidDepartureException extends RuntimeException{
    public InvalidDepartureException() {
        super("A data não pode ultrapassar 1 semana");
    }    
}
