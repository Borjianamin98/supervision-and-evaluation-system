import {User} from "../user/user";

export interface ScheduleEvent {
    id: number,
    startDate: Date,
    endDate: Date,
    owner: User,
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