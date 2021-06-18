import {ScheduleState} from "./ScheduleState";

export interface MeetSchedule {
    id: number,
    durationMinutes: number,
    minimumDate: Date,
    maximumDate: Date,
    scheduleState: ScheduleState,
    finalizedDate?: Date,

    announcedUsers: number[]
}