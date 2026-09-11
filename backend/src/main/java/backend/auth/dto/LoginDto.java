package backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record LoginDto(
    @NotNull (message = "O email é obrigatório")
    String email,

    @NotNull(message = "A senha é obrigatória")
    String password
) {} 