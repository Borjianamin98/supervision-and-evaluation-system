package ir.ac.sbu.evaluation.repository.notification;

import ir.ac.sbu.evaluation.model.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    long countAllByUserIdAndSeen(long userId, boolean seen);

    Page<Notification> findAllByUserId(long userId, Pageable pageable);
}
