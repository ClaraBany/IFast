package backend.ride_request;

import backend.shared.enums.Neighborhoods;
import backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ride_request")
@EntityListeners(AuditingEntityListener.class)
public class RideRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods origin;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Neighborhoods destination;

    @Column(nullable = false)
    private LocalDateTime desiredDepartureStart;

    @Column(nullable = false)
    private LocalDateTime desiredDepartureEnd;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
