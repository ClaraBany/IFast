package backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record RegisterDto (
    @NotNull (message = "O nome é obrigatório") 
    String name,

    @NotNull (message = "O email é obrigatório")
    String email,
    
    @NotNull(message = "A senha é obrigatória")
    String password
){}
//tamanho mínimo dos campos? 