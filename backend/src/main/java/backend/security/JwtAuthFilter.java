package backend.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import backend.exceptions.TokenJwtInvalidException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtAuthFilter extends OncePerRequestFilter{
    
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService, HandlerExceptionResolver handlerExceptionResolver){
        this.jwtService = jwtService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override 
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        final String authHeader = request.getHeader("Authorization");
        
        String path = request.getServletPath();

        if (path.equals("/login") || path.equals("/login/google") || path.equals("/register")) {
            filterChain.doFilter(request, response);
            return;
        }
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            SecurityContextHolder.clearContext();
            handlerExceptionResolver.resolveException(request, response, null, new TokenJwtInvalidException());
            return;
        }

        final String jwt = authHeader.substring(7);

        try{
            Long userId = jwtService.validateToken(jwt);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());

            SecurityContextHolder
                .getContext().setAuthentication(authentication);
            
            filterChain.doFilter(request, response);
        } catch (Exception e){
            SecurityContextHolder.clearContext();
            handlerExceptionResolver.resolveException(request, response, null, new TokenJwtInvalidException());
        }
    }   
}