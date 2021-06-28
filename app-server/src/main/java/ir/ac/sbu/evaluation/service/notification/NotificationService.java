package ir.ac.sbu.evaluation.service.notification;

import ir.ac.sbu.evaluation.repository.notification.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public long numberOfNotifications(long userId, boolean seen) {
        return notificationRepository.countAllByUserIdAndSeen(userId, seen);
    }

}
