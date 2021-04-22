export interface Problem {
    id?: number,

    education: string,

    title: string,
    englishTitle: string,
    keywords: string[],

    definition: string,
    history: string,
    considerations: string

    supervisor?: string,
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