package backend.user.dto;

import backend.user.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileDto(
    @NotBlank(message = "O nome é obrigatório")
    @Size(min= 10, max = 100, message = "O nome deve conter entre 10 a 100 caracteres")
    String name,

    @Size(min= 10, message = "O endereço deve ter pelo menos 10 caracteres")
    String address,

    @Pattern(regexp = "^\\(\\d{2}\\) \\d{5}-\\d{4}$", message = "Telefone inválido")
    String phoneNumber
) {}
