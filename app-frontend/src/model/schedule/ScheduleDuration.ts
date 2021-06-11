export enum ScheduleDuration {
    THIRTY_MINUTES = 30,
    ONE_HOUR = 60,
    ONE_AND_HALF_HOUR = 90,
    TWO_HOUR = 120,
}

export const PERSIAN_SCHEDULE_DURATIONS = [
    "30 دقیقه",
    "یک ساعت",
    "یک ساعت و 30 دقیقه",
    "دو ساعت",
];

export const ENGLISH_SCHEDULE_DURATIONS = [
    ScheduleDuration.THIRTY_MINUTES,
    ScheduleDuration.ONE_HOUR,
    ScheduleDuration.ONE_AND_HALF_HOUR,
    ScheduleDuration.TWO_HOUR,
];

export const scheduleDurationMapToEnglish = (scheduleDuration: string) => {
    return ENGLISH_SCHEDULE_DURATIONS[PERSIAN_SCHEDULE_DURATIONS.indexOf(scheduleDuration)];
}

export const scheduleDurationMapToPersian = (scheduleDuration: ScheduleDuration) => {
    return PERSIAN_SCHEDULE_DURATIONS[ENGLISH_SCHEDULE_DURATIONS.indexOf(scheduleDuration)];
}