import apiAxios from "../../../config/axios-config";

class NotificationService {

    private static readonly API_NOTIFICATION_ROOT_PATH = "/notification"

    private constructor() {
    }

    static numberOfNotifications(seen: boolean) {
        return apiAxios
            .get<number>(`${NotificationService.API_NOTIFICATION_ROOT_PATH}/count`, {
                params: {
                    seen,
                }
            })
            .then(response => response.data);
    }

}

export default NotificationService;