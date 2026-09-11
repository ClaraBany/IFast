package backend.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import backend.auth.dto.AuthResponseDto;
import backend.auth.dto.LoginDto;
import backend.auth.dto.LoginGoogleDto;
import backend.auth.dto.RegisterDto;
import backend.exceptions.EmailAlreadyRegisteredException;
import backend.exceptions.GoogleAccountException;
import backend.exceptions.InvalidGoogleTokenException;
import backend.exceptions.InvalidPasswordException;
import backend.exceptions.UserNotFoundException;
import backend.security.GoogleIdTokenService;
import backend.security.JwtService;

import org.springframework.transaction.annotation.Transactional;

@Service 
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleIdTokenService googleIdTokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, GoogleIdTokenService googleIdTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleIdTokenService = googleIdTokenService;
    }

    public AuthResponseDto login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.email())
            .orElseThrow(() -> new UserNotFoundException());

        if(user.getPassword() == null){
            throw new GoogleAccountException();
        }

        if(!passwordEncoder.matches(loginDto.password(), user.getPassword())){
            throw new InvalidPasswordException();
        }

        String token = jwtService.gerarToken(user.getId());
        return new AuthResponseDto(token);
    }

    public AuthResponseDto loginGoogle(LoginGoogleDto loginGoogleDto) {
        GoogleIdToken.Payload payload = googleIdTokenService.validar(loginGoogleDto.idToken());

        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new InvalidGoogleTokenException();
        }
    
        String email = payload.getEmail();

        if (!email.endsWith("ifnmg.edu.br")) {
            throw new InvalidGoogleTokenException("Somente e-mails institucionais são permitidos");
        }

        User user = userRepository.findByGoogleId(payload.getSubject())
            .orElseGet(() -> registerOrLinkGoogle(payload));

        String token = jwtService.gerarToken(user.getId());
        
        return new AuthResponseDto(token);
    }
    
    @Transactional 
    public AuthResponseDto register(RegisterDto registerDto) {
        if(userRepository.findByEmail(registerDto.email()).isPresent()) {
            throw new EmailAlreadyRegisteredException();
        }

        String hash = passwordEncoder.encode(registerDto.password());

        User user = new User();
        
        user.setEmail(registerDto.email());
        user.setName(registerDto.name());
        user.setPassword(hash);
        userRepository.save(user);

        String token = jwtService.gerarToken(user.getId());

        return new AuthResponseDto(token);
    }

    @Transactional 
    public User registerOrLinkGoogle(GoogleIdToken.Payload payload) {

        Optional<User> existingUser =
            userRepository.findByEmail(payload.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            user.setGoogleId(payload.getSubject());
            user.setPictureUrl((String) payload.get("picture"));

            return userRepository.save(user);
        }

        User user = new User();

        user.setEmail(payload.getEmail());
        user.setName((String) payload.get("name"));
        user.setPictureUrl((String) payload.get("picture"));
        user.setGoogleId(payload.getSubject());

        return userRepository.save(user);
    }
}