package backend.user;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);

    @Query("""
    select count(u) from User u
    where (:startDate is null or u.createdAt >= :startDate)
      and (:endDateExclusive is null or u.createdAt < :endDateExclusive)
    """)
    long countByCreatedAtDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDateExclusive") LocalDateTime endDateExclusive);
}