package backend.vehicle;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.IdResponseDto;
import backend.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service 
public class VehicleService {

    VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository){
        this.vehicleRepository = vehicleRepository;
    }

    public List<VehicleDto> getAll(User user){
        return vehicleRepository.findByUser(user)
            .stream()
            .map(VehicleDto::new)
            .toList();
    }

    public VehicleDto get(Long vehicleId, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(EntityNotFoundException::new);
        
        return new VehicleDto(vehicle);
    }
    
    @Transactional
    public IdResponseDto create(VehicleDto vehicleDto, User user){
        Vehicle vehicle = new Vehicle();

        vehicle.setUser(user);
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setCapacity(vehicleDto.getCapacity());
        vehicle.setPlate(vehicleDto.getPlate());     

        return new IdResponseDto(vehicleRepository.save(vehicle).getId());
    }

    @Transactional
    public IdResponseDto update(Long vehicleId, VehicleDto vehicleDto, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(EntityNotFoundException::new);

        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setCapacity(vehicleDto.getCapacity());
        vehicle.setPlate(vehicleDto.getPlate());     

        return new IdResponseDto(vehicleRepository.save(vehicle).getId());
    }

    @Transactional
    public void delete(Long vehicleId, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(EntityNotFoundException::new);
        
        vehicleRepository.delete(vehicle);
    }
}