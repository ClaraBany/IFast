package backend.vehicle;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import backend.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Entity 
@Table (name = "vehicle")
@EntityListeners (AuditingEntityListener.class)
public class Vehicle {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private String color;

    @Column(nullable = true)
    private Integer capacity;

    @Column(nullable = true)
    private String plate;
}