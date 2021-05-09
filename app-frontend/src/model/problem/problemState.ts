export enum ProblemState {
    CREATED = "CREATED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ABANDONED = "ABANDONED"
}

export const PERSIAN_PROBLEM_STATES = [
    "ایجاد شده",
    "در حال پیگیری",
    "اتمام یافته",
    "لغو شده"
];

export const ENGLISH_PROBLEM_STATES = [
    ProblemState.CREATED,
    ProblemState.IN_PROGRESS,
    ProblemState.COMPLETED,
    ProblemState.ABANDONED
];

export const problemStateMapToEnglish = (problemState: string) => {
    return ENGLISH_PROBLEM_STATES[PERSIAN_PROBLEM_STATES.indexOf(problemState)];
}

export const problemStateMapToPersian = (problemState: ProblemState) => {
    return PERSIAN_PROBLEM_STATES[ENGLISH_PROBLEM_STATES.indexOf(problemState)];
}