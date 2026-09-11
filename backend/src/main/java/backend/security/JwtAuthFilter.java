package backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import backend.exceptions.TokenJwtInvalidException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtAuthFilter extends OncePerRequestFilter{
    
    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService){
        this.jwtService = jwtService;
    }

    @Override 
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        final String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try{
            Long userId = jwtService.validarToken(jwt);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, null);

            SecurityContextHolder
                .getContext().setAuthentication(authentication);
        } catch (Exception e){
            SecurityContextHolder.clearContext();
            throw new TokenJwtInvalidException();
        }

        filterChain.doFilter(request, response);
    }   
}