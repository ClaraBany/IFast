package backend.auth.dto;

import java.util.List;

public record ErrorResponseDto(
    String message,
    List<String> errors
) {} 