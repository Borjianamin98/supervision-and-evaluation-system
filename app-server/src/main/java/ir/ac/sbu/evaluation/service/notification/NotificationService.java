package ir.ac.sbu.evaluation.service.notification;

import ir.ac.sbu.evaluation.dto.notification.NotificationDto;
import ir.ac.sbu.evaluation.model.notification.Notification;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.notification.NotificationRepository;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void sendNotification(String content, User... receivers) {
        notificationRepository.saveAll(Arrays.stream(receivers)
                .map(receiver -> Notification.builder()
                        .content(content)
                        .user(receiver)
                        .build())
                .collect(Collectors.toSet()));
    }

    public long numberOfNotifications(long userId, boolean seen) {
        return notificationRepository.countAllByUserIdAndSeen(userId, seen);
    }

    public Page<NotificationDto> retrieveNotifications(long userId, Pageable pageable) {
        return notificationRepository.findAllByUserId(userId, pageable).map(NotificationDto::from);
    }

}
