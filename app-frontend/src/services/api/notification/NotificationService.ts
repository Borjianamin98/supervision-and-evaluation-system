import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/api/Pageable";
import {AppNotification} from "../../../model/notification/Notification";

class NotificationService {

    private static readonly API_NOTIFICATION_ROOT_PATH = "/notification"

    private constructor() {
    }

    static retrieveNotifications(pageSize: number, page: number,
                                 sortBys?: string[], sortDirections?: ("asc" | "desc")[]) {
        // sortBys?.map((value, index) => )
        const params = new URLSearchParams();
        params.append("size", pageSize.toString());
        params.append("page", page.toString());
        sortBys?.forEach((value, index) =>
            params.append("sort", sortDirections && index < sortDirections.length ?
                `${value},${sortDirections[index]}` : value));

        return apiAxios
            .get<Pageable<AppNotification>>(`${NotificationService.API_NOTIFICATION_ROOT_PATH}`, {
                params: params
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