import apiAxios from "../../../config/axios-config";
import {DateRange} from "../../../model/schedule/event/DateRange";
import {ScheduleEvent} from "../../../model/schedule/event/ScheduleEvent";
import {MeetSchedule} from "../../../model/schedule/MeetSchedule";
import {MeetScheduleSave} from "../../../model/schedule/MeetScheduleSave";

class ScheduleService {

    private static readonly API_SCHEDULE_ROOT_PATH = "/schedule"

    private constructor() {
    }

    static startMeetSchedule(meetScheduleId: number, meetScheduleSave: MeetScheduleSave) {
        return apiAxios
            .post<MeetSchedule>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/start`,
                meetScheduleSave)
            .then(response => response.data)
    }

    static updateMeetScheduleDate(meetScheduleId: number, dateRange: DateRange) {
        return apiAxios
            .post<MeetSchedule>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/updateDate`,
                dateRange)
            .then(response => response.data)
    }

    static retrieveMeetScheduleEvents(meetScheduleId: number, startDate: Date, endDate: Date) {
        return apiAxios
            .get<ScheduleEvent[]>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/events`,
                {
                    params: {
                        startDate,
                        endDate,
                    }
                })
            .then(response => response.data)
    }

    static addMeetScheduleEvent(meetScheduleId: number, dateRange: DateRange) {
        return apiAxios
            .post<ScheduleEvent>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event`,
                dateRange)
            .then(response => response.data)
    }

    static updateMeetScheduleEvent(meetScheduleId: number, scheduleEventId: number, updatedDates: DateRange) {
        return apiAxios
            .post<ScheduleEvent>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event/${scheduleEventId}`,
                updatedDates)
            .then(response => response.data)
    }

    static deleteMeetScheduleEvent(meetScheduleId: number, scheduleEventId: number) {
        return apiAxios
            .delete<ScheduleEvent>(`${ScheduleService.API_SCHEDULE_ROOT_PATH}/${meetScheduleId}/event/${scheduleEventId}`)
            .then(response => response.data)
    }

}

export default ScheduleService;