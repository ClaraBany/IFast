package backend.security;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import backend.exceptions.InvalidGoogleTokenException;

@Service 
public class GoogleIdTokenService {

    @Value ("${google.client-id}")
    private String clientId;

    public GoogleIdToken.Payload validar(String idToken) {
        try {
            if (idToken == null || idToken.split("\\.").length != 3) {
                throw new InvalidGoogleTokenException();
            }
            
            GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
                )
                .setAudience(Collections.singletonList(clientId))
                .build();
        
            GoogleIdToken googleIdToken = verifier.verify(idToken);

            if (googleIdToken == null) {
                throw new InvalidGoogleTokenException();
            }

            return googleIdToken.getPayload();

        } catch (GeneralSecurityException | IOException e) {
            throw new InvalidGoogleTokenException();
        }
    }
}