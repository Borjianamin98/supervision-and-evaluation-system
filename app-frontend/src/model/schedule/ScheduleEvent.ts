import {User} from "../user/user";

export interface ScheduleEventInfo {
    id: number,
    startDate: Date,
    endDate: Date,
    owner: User,
}

export interface ScheduleEventDate {
    startDate: Date,
    endDate: Date,
}

export interface SyncfusionSchedulerEvent {
    id: number,
    subject: string,
    startDate: Date,
    endDate: Date,
    isAllDay: boolean,
    readonly?: boolean,
    ownerId: number,
}