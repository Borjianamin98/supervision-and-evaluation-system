import apiAxios from "../../../config/axios-config";
import {ScheduleEvent} from "../../../model/schedule/ScheduleEvent";
import {API_SCHEDULE_RESOURCE_EVENTS_PATH} from "../../ApiPaths";

class ScheduleService {

    private constructor() {
    }

    static retrieveScheduleEvents(scheduleId: number, startDate: Date, endDate: Date) {
        return apiAxios.get<ScheduleEvent[]>(
            API_SCHEDULE_RESOURCE_EVENTS_PATH.replace("{0}", String(scheduleId)),
            {
                params: {
                    startDate,
                    endDate,
                }
            }).then(response => response.data)
    }

}

export default ScheduleService;