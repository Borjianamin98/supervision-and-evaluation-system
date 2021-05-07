export enum ProblemState {
    CREATED = "CREATED",
    ABANDONED = "ABANDONED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export const PERSIAN_PROBLEM_STATES = [
    "ایجاد شده",
    "لغو شده",
    "در حال پیگیری",
    "اتمام یافته"
];

export const ENGLISH_PROBLEM_STATES = [
    ProblemState.CREATED,
    ProblemState.ABANDONED,
    ProblemState.IN_PROGRESS,
    ProblemState.COMPLETED
];

export const problemStateMapToEnglish = (problemState: string) => {
    return ENGLISH_PROBLEM_STATES[PERSIAN_PROBLEM_STATES.indexOf(problemState)];
}

export const problemStateMapToPersian = (problemState: ProblemState) => {
    return PERSIAN_PROBLEM_STATES[ENGLISH_PROBLEM_STATES.indexOf(problemState)];
}