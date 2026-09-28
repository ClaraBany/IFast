package backend.auth.dto;

import backend.user.dto.UserDto;
import jakarta.validation.constraints.NotBlank;

public record AuthResponseDto(
    @NotBlank
    UserDto user,

    @NotBlank
    String token
) {} 