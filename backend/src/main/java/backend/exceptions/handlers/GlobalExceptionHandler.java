package backend.exceptions.handlers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import backend.auth.dto.ErrorResponseDto;
import backend.exceptions.EmailAlreadyRegisteredException;
import backend.exceptions.GoogleAccountException;
import backend.exceptions.InvalidGoogleTokenException;
import backend.exceptions.InvalidPasswordException;
import backend.exceptions.TokenJwtInvalidException;
import backend.exceptions.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
//TODO: lembrar de inserirlogs
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException e, HttpServletRequest request) {
        List<String> errors = e.getBindingResult().getFieldErrors()
            .stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .toList();
        return ResponseEntity.badRequest().body(
            new ErrorResponseDto("Validation failed", errors)
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidBody(HttpMessageNotReadableException e, HttpServletRequest request) {
        return ResponseEntity.badRequest().body(
            new ErrorResponseDto("Invalid or missing request body",
                List.of(e.getMostSpecificCause().getMessage()))
        );
    }

    @ExceptionHandler({BadCredentialsException.class, InvalidGoogleTokenException.class, InvalidPasswordException.class, GoogleAccountException.class, TokenJwtInvalidException.class})
    public ResponseEntity<ErrorResponseDto> handleAuth(Exception e, HttpServletRequest request) {
        return ResponseEntity.status(401).body(
            new ErrorResponseDto("Authentication failed", List.of(e.getMessage()))
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        return ResponseEntity.status(403).body(
            new ErrorResponseDto("Access denied", List.of(e.getMessage()))
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFound(UserNotFoundException e, HttpServletRequest request) {
        return ResponseEntity.status(404).body(
            new ErrorResponseDto(e.getMessage(), null)
        );
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ErrorResponseDto> handleConflict(EmailAlreadyRegisteredException e, HttpServletRequest request) {
        return ResponseEntity.status(409).body(
            new ErrorResponseDto(e.getMessage(), null)
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneric(Exception e, HttpServletRequest request) {
        return ResponseEntity.status(500).body(
            new ErrorResponseDto("Internal server error", List.of(e.getMessage()))
        );
    }
}