package backend.exceptions;

public class TokenJwtInvalidException extends RuntimeException{
    public TokenJwtInvalidException() {
        super("Token inválido");
    }
}