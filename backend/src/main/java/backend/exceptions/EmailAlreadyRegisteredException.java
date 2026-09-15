package backend.exceptions;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(){
        super("O email já foi cadastrado");
    }
}