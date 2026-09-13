package backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.auth.dto.AuthResponseDto;
import backend.auth.dto.LoginDto;
import backend.auth.dto.UserDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/")
public class TesteController {

    @PostMapping("/teste")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        AuthResponseDto response = new AuthResponseDto(new UserDto(null, null, null), "sucesso");
        return ResponseEntity.ok(response);
    }

}