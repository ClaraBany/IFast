package backend.user;

import backend.user.dto.ProfileResponseDto;
import backend.user.dto.UpdateProfileDto;
import backend.user.dto.UserDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new UserDto(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponseDto> getProfile(@PathVariable Long id,
                                                         @AuthenticationPrincipal User user) {
        ProfileResponseDto response = userService.getProfile(id, user.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateProfileDto updateProfileDto,
                                                 @AuthenticationPrincipal User user) {
        UserDto response = userService.updateProfile(updateProfileDto, user.getId());
        return ResponseEntity.ok(response);
    }
}