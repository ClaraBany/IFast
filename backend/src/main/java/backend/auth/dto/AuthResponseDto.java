package backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthResponseDto(
    @NotBlank
    UserDto user,

    @NotBlank
    String token
) {} 