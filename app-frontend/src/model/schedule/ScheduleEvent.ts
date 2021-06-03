import {User} from "../user/user";

export interface ScheduleEventInfo {
    id: number,
    startDate: Date,
    endDate: Date,
    owner: User,
}

export interface ScheduleEventCreate {
    startDate: Date,
    endDate: Date,
}

export interface SyncfusionSchedulerEvent {
    id: number,
    subject: string,
    startDate: Date,
    endDate: Date,
    isAllDay: boolean,
    isReadonly?: boolean,
    ownerId: number,
}