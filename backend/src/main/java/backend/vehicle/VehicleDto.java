package backend.vehicle;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
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

    private String plate;

    public VehicleDto(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.model = vehicle.getModel();
        this.color = vehicle.getColor();
        this.capacity = vehicle.getCapacity();
        this.plate = vehicle.getPlate();
    }
}
