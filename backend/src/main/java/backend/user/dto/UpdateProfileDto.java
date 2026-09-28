package backend.user.dto;

import backend.user.Neighborhoods;
import backend.validation.ValidationPatterns;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileDto(
    @NotBlank(message = "O nome é obrigatório")
    @Size(min= 10, max = 100, message = "O nome deve conter entre 10 a 100 caracteres")
    String name,

    Neighborhoods address,

    @Pattern(regexp = ValidationPatterns.PHONE, message = "Telefone inválido")
    String phoneNumber
) {
    @AssertTrue(message = "IFNMG não é um endereço válido")
    public boolean isValidNeighborhood() {
        if (address == null) {
            return true;
        }

        return address != Neighborhoods.IFNMG;
    }
}
