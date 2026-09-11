package backend.auth;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
@Entity
public class User {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique  = true)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = true, unique = true)
    private String googleId;

    @Column(nullable = true)
    private String pictureUrl;

    @Column(nullable = true)
    private String adress; //como armazenar o adress?

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}