import apiAxios from "../../../config/axios-config";
import {ScheduleEventDate, ScheduleEventInfo} from "../../../model/schedule/ScheduleEvent";

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

    static addMeetScheduleEvent(meetScheduleId: number, scheduleEvent: ScheduleEventDate) {
        return apiAxios.post<ScheduleEventInfo>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event`,
            scheduleEvent).then(response => response.data)
    }

    static updateMeetScheduleEvent(meetScheduleId: number, scheduleEventId: number, updatedDates: ScheduleEventDate) {
        return apiAxios.post<ScheduleEventInfo>(
            `${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event/${scheduleEventId}`, updatedDates)
            .then(response => response.data)
    }

    static deleteMeetScheduleEvent(meetScheduleId: number, scheduleEventId: number) {
        return apiAxios.delete<ScheduleEventInfo>(
            `${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event/${scheduleEventId}`)
            .then(response => response.data)
    }

}

export default ScheduleService;