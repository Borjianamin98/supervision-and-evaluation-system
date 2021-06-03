import apiAxios from "../../../config/axios-config";
import {ScheduleEventInfo} from "../../../model/schedule/ScheduleEvent";

class ScheduleService {

    private static readonly API_SCHEDULE_ROOT_PATH = "/schedule"

    private constructor() {
    }

    static retrieveMeetScheduleEvents(meetScheduleId: number, startDate: Date, endDate: Date) {
        return apiAxios.get<ScheduleEventInfo[]>(
            `${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/events`,
            {
                params: {
                    startDate,
                    endDate,
                }
            }).then(response => response.data)
    }

}

export default ScheduleService;