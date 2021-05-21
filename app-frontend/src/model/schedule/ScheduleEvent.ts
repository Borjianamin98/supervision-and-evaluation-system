export interface ScheduleEvent {
    id: number,
    subject: string,
    startDate: Date,
    endDate: Date,
    isAllDay: boolean,
    isReadonly?: boolean,
    ownerId: number,
}