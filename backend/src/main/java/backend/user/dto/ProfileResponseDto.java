package backend.user.dto;

public record ProfileResponseDto(
    UserDto user,
    Long ridesAsDriverCount,
    Long ridesAsPassengerCount
) {}
