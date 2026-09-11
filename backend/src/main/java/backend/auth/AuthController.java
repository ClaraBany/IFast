package backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.auth.dto.AuthResponseDto;
import backend.auth.dto.LoginDto;
import backend.auth.dto.LoginGoogleDto;
import backend.auth.dto.RegisterDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        AuthResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login/google")
    public ResponseEntity<AuthResponseDto> loginGoogle(@Valid @RequestBody LoginGoogleDto loginGoogleDto) {
        AuthResponseDto response = authService.loginGoogle(loginGoogleDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterDto registerDto) {
        AuthResponseDto response = authService.register(registerDto);
        return ResponseEntity.ok(response);
    }
}