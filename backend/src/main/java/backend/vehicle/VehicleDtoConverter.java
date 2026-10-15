package backend.vehicle;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.databind.ObjectMapper;

@Converter (autoApply = true)
public class VehicleDtoConverter implements AttributeConverter<VehicleDto, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(VehicleDto dto) {
        try {
            return mapper.writeValueAsString(dto);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error converting VehicleDto to JSON", e);
        }
    }

    @Override
    public VehicleDto convertToEntityAttribute(String json) {
        try {
            return mapper.readValue(json, VehicleDto.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error converting JSON to VehicleDto", e);
        }
    }
}
