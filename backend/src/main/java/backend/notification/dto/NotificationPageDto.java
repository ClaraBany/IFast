package backend.notification.dto;

import java.util.List;

public record NotificationPageDto(List<NotificationDto> content, boolean hasNext) {}
