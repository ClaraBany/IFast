package backend.vehicle;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.user.User;
import backend.exceptions.EntityNotFoundException;

@Service 
public class VehicleService {

    VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository){
        this.vehicleRepository = vehicleRepository;
    }
    
    public VehicleDto create(VehicleDto vehicleDto, User user){
        Vehicle vehicle = new Vehicle();

        vehicle.setUser(user);
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setCapacity(vehicleDto.getCapacity());
        vehicle.setPlate(vehicleDto.getPlate());     

        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }

    public VehicleDto get(Long vehicleId, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(() -> new EntityNotFoundException());
        
        return new VehicleDto(vehicle);
    }

    public List<VehicleDto> getAll(User user){
        return vehicleRepository.findByUser(user)
            .stream()
            .map(VehicleDto::new)
            .toList();
    }

    public void delete(Long vehicleId, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(() -> new EntityNotFoundException());
        
        vehicleRepository.delete(vehicle);
    }

    public VehicleDto update(Long vehicleId, VehicleDto vehicleDto, User user){
        Vehicle vehicle = vehicleRepository.findByIdAndUser(vehicleId, user)
            .orElseThrow(() -> new EntityNotFoundException());

        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setCapacity(vehicleDto.getCapacity());
        vehicle.setPlate(vehicleDto.getPlate());     

        vehicleRepository.save(vehicle);

        return new VehicleDto(vehicle);
    }
}