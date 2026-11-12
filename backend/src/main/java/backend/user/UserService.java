package backend.user;

import backend.ride_booking.RideBookingRepository;
import backend.ride_offer.RideOfferRepository;
import backend.ride_offer.enums.StatusOffer;
import backend.user.dto.ProfileResponseDto;
import backend.user.dto.UpdateProfileDto;
import backend.user.dto.UserDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final RideOfferRepository rideOfferRepository;
    private final RideBookingRepository rideBookingRepository;

    public ProfileResponseDto getProfile(Long id, Long currentUserId) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        Long ridesAsDriverCount = rideOfferRepository.countByDriverAndStatus(user, StatusOffer.COMPLETED);
        Long ridesAsPassengerCount = rideBookingRepository.countCompletedRidesByPassenger(user);

        if (!currentUserId.equals(id)) {
            user.setAddress(null);
        }

        return new ProfileResponseDto(new UserDto(user), ridesAsDriverCount, ridesAsPassengerCount);
    }

    public UserDto updateProfile(UpdateProfileDto updateProfileDto, Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);

        user.setName(updateProfileDto.name());
        user.setAddress(updateProfileDto.address());
        user.setPhoneNumber(updateProfileDto.phoneNumber());

        return new UserDto(userRepository.save(user));
    }
}
