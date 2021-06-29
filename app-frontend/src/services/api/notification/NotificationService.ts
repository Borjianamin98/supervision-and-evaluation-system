import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/api/Pageable";
import {AppNotification} from "../../../model/notification/Notification";

class NotificationService {

    private static readonly API_NOTIFICATION_ROOT_PATH = "/notification"

    private constructor() {
    }

    static retrieveNotifications(pageSize: number, page: number, sortBy?: string, sortDirection?: "asc" | "desc") {
        return apiAxios
            .get<Pageable<AppNotification>>(`${NotificationService.API_NOTIFICATION_ROOT_PATH}`, {
                params: {
                    size: pageSize,
                    page: page,
                    sort: sortBy ? (sortDirection ? `${sortBy},${sortDirection}` : sortBy) : undefined,
                }
            })
            .then(response => response.data);
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