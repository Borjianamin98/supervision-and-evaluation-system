import apiAxios from "../../../config/axios-config";
import {ScheduleEvent} from "../../../model/schedule/ScheduleEvent";

class ScheduleService {

    private static readonly API_SCHEDULE_ROOT_PATH = "/schedule"

    private constructor() {
    }

    static retrieveScheduleEvents(scheduleId: number, startDate: Date, endDate: Date) {
        return apiAxios.get<ScheduleEvent[]>(
            `${ScheduleService.API_SCHEDULE_ROOT_PATH}/${scheduleId}/events`,
            {
                params: {
                    startDate,
                    endDate,
                }
            }).then(response => response.data)
    }

}

export default ScheduleService;