package ir.ac.sbu.evaluation.controller.notification;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_NOTIFICATION_ROOT_PATH;

import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.notification.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_NOTIFICATION_ROOT_PATH)
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(path = {"/", ""})
    public long numberOfNotifications(
            @RequestParam(name = "seen") boolean seen,
            @ModelAttribute AuthUserDetail authUserDetail) {
        return notificationService.numberOfNotifications(authUserDetail.getUserId(), seen);
    }

}
