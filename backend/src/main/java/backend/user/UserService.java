package backend.user;

import backend.user.dto.ProfileResponseDto;
import backend.user.dto.UpdateProfileDto;
import backend.user.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public ProfileResponseDto getProfile(Long id) {
        User user = userRepository.findById(id).orElseThrow();

        Long ridesAsDriverCount = 0L; //TODO: Adicionar logica de contagem quando feat carona estiver pronta
        Long ridesAsPassengerCount = 0L;

        return new ProfileResponseDto(new UserDto(user), ridesAsDriverCount, ridesAsPassengerCount);
    }

    public UserDto updateProfile(UpdateProfileDto updateProfileDto, Long id) {
        User user = userRepository.findById(id).orElseThrow();

        user.setName(updateProfileDto.name());
        user.setAddress(updateProfileDto.address());
        user.setPhoneNumber(updateProfileDto.phoneNumber());

        return new UserDto(userRepository.save(user));
    }
}
