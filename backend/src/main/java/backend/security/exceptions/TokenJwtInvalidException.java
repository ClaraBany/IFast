package backend.security.exceptions;

import org.springframework.security.core.AuthenticationException;

public class TokenJwtInvalidException extends AuthenticationException{
    public TokenJwtInvalidException() {
        super("Token inválido");
    }
}