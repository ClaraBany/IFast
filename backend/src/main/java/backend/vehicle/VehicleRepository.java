package backend.vehicle;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.auth.User;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>{
    Optional<Vehicle> findByIdAndUser(Long id, User user);
    List<Vehicle> findByUser(User user);
}
