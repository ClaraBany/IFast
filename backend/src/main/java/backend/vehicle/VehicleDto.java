package backend.vehicle;

import com.fasterxml.jackson.annotation.JsonProperty;

import backend.validation.ValidationPatterns;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor
public class VehicleDto {    
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank 
    private String model;
    
    @NotBlank 
    private String color;

    private Integer capacity;

    @Pattern(
        regexp = "(" + ValidationPatterns.PLATE + ")|(" + ValidationPatterns.PLATE_MERCOSUL + ")",
        message = "A placa deve seguir o padrão antigo (ABC1234) ou Mercosul (ABC1D23)"
    )
    private String plate;

    public VehicleDto(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.model = vehicle.getModel();
        this.color = vehicle.getColor();
        this.capacity = vehicle.getCapacity();
        this.plate = vehicle.getPlate();
    }
}
