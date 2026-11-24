package backend.shared.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public record PaginationParamsDto(
        @Min(value = 0, message = "A página deve ser maior ou igual a 0")
        Integer page,

        @Min(value = 1, message = "O tamanho deve ser no mínimo 1")
        @Max(value = 50, message = "O tamanho deve ser no máximo 50")
        Integer size
) {
    public PaginationParamsDto {
        page = page == null ? 0 : page;
        size = size == null ? 20 : size;
    }

    public Pageable toPageable() {
        return PageRequest.of(page, size);
    }
}
