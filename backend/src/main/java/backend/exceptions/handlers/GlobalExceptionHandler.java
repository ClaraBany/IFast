package backend.exceptions.handlers;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import backend.dto.ErrorResponseDto;
import backend.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<ErrorResponseDto> buildResponse
        (Exception e, HttpServletRequest request, HttpStatus status, 
        String message, List<String> details) {

        String errorId = UUID.randomUUID().toString();

        if (status.is5xxServerError()) {
            logger.error("ErrorId={} | Path={} | Status={} | Exception={}",
                errorId, request.getRequestURI(), status.value(), e.toString(), e);
        } else {
            logger.warn("ErrorId={} | Path={} | Status={} | Exception={} | Message={}",
                errorId, request.getRequestURI(), status.value(), e.getClass().getSimpleName(), e.getMessage());
        }

        return ResponseEntity.status(status).body(new ErrorResponseDto(message, details));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException e, HttpServletRequest request) {
        List<String> details = e.getBindingResult().getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .toList();
        return buildResponse(e, request, HttpStatus.BAD_REQUEST, "Falha na validação", details);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponseDto> handleConstraintViolation(ConstraintViolationException e, HttpServletRequest request) {
        List<String> details = e.getConstraintViolations()
                .stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();
        return buildResponse(e, request, HttpStatus.BAD_REQUEST, "Falha na validação", details);
    }

    @ExceptionHandler({MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorResponseDto> handleBadParameter(Exception e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.BAD_REQUEST, "Parâmetros inválidos", null);
    }
    
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponseDto> handleMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.METHOD_NOT_ALLOWED,
        "Método HTTP inválido para essa requisição", null);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoResourceFound(NoResourceFoundException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.NOT_FOUND, "Recurso não encontrado", null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidBody(HttpMessageNotReadableException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.BAD_REQUEST, "Body da requisição inválido ou ausente", null);
    }

    @ExceptionHandler({BadCredentialsException.class, InvalidGoogleTokenException.class,
            InvalidPasswordException.class, GoogleAccountException.class, TokenJwtInvalidException.class})
    public ResponseEntity<ErrorResponseDto> handleAuth(Exception e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.UNAUTHORIZED, e.getMessage(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.FORBIDDEN, "Acesso negado", null);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFound(UserNotFoundException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.NOT_FOUND, e.getMessage(), null);
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ErrorResponseDto> handleConflict(EmailAlreadyRegisteredException e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.CONFLICT, e.getMessage(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneric(Exception e, HttpServletRequest request) {
        return buildResponse(e, request, HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor", null);
    }
}