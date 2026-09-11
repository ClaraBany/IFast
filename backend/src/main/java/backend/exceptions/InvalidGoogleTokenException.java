package backend.exceptions;

public class InvalidGoogleTokenException extends RuntimeException {
    public InvalidGoogleTokenException() {
        super("Token do google inválido");
    }

    public InvalidGoogleTokenException(String message) {
        super(message);
    }
}