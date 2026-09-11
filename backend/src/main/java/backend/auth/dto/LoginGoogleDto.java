package backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record LoginGoogleDto(
    @NotNull (message = "O IdToken é obrigatório")
    String idToken
) {} 