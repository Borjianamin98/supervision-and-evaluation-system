import {MeetScheduleState} from "./MeetScheduleState";

export interface MeetSchedule {
    id: number,
    durationMinutes: number,
    minimumDate: Date,
    maximumDate: Date,
    state: MeetScheduleState,
    finalizedDate?: Date,
    meetingHeld: boolean,

    announcedUsers: number[]
}