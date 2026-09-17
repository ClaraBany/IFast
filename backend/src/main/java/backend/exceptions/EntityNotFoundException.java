package backend.exceptions;

public class EntityNotFoundException extends RuntimeException{
    public EntityNotFoundException(){
        super("Entidade não encontrada");
    }
}
