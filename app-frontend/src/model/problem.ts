import {User} from "./user";

export interface Problem {
    id?: number,

    education: string,

    title: string,
    englishTitle: string,
    keywords: string[],

    definition: string,
    history: string,
    considerations: string

    supervisor?: User,
}

export const PERSIAN_EDUCATIONS = [
    "کارشناسی",
    "کارشناسی ارشد",
    "دکتری"
];

export const ENGLISH_EDUCATIONS = [
    "BACHELOR",
    "MASTER",
    "DOCTORATE"
];

export const educationPersianMapping = (education: string) => {
    return ENGLISH_EDUCATIONS[PERSIAN_EDUCATIONS.indexOf(education)];
}

export const educationEnglishMapping = (education: string) => {
    return PERSIAN_EDUCATIONS[ENGLISH_EDUCATIONS.indexOf(education)];
}