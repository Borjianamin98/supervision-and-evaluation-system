export interface MeetScheduleSave {
    durationMinutes: number,
    minimumDate: Date,
    maximumDate: Date,
    finalizedDate?: Date,
}