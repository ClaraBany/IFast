package backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthResponseDto(
    @NotBlank
    String token
) {} 