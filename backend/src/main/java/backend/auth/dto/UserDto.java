package backend.auth.dto;

public record UserDto(
    Long id,
    String name,
    String email
) {}   