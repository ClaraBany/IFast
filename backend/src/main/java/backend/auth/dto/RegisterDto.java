package backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterDto (
    @NotBlank (message = "O nome é obrigatório")
    @Size (min= 10, max = 100, message = "O nome deve conter entre 10 a 100 caracteres") 
    String name,

    @NotBlank (message = "O email é obrigatório")
    @Email (message = "Deve ser um inválido")
    String email,
    
    @NotBlank (message = "A senha é obrigatória")
    @Size (min= 6, message = "A senha deve conter no minimo 6 caracteres") 
    String password
){}