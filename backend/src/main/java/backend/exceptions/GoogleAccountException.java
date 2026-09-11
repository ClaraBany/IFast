package backend.exceptions;

public class GoogleAccountException extends RuntimeException {
    public GoogleAccountException() {
        super("O usuário deve fazer login pelo o Google");
    }
}