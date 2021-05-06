export enum Education {
    BACHELOR = "BACHELOR",
    MASTER = "MASTER",
    DOCTORATE = "DOCTORATE",
}

export const PERSIAN_EDUCATIONS = [
    "کارشناسی",
    "کارشناسی ارشد",
    "دکتری",
];

export const ENGLISH_EDUCATIONS = [
    Education.BACHELOR,
    Education.MASTER,
    Education.DOCTORATE,
];

export const educationMapToEnglish = (education: string) => {
    return ENGLISH_EDUCATIONS[PERSIAN_EDUCATIONS.indexOf(education)];
}

export const educationMapToPersian = (education: Education) => {
    return PERSIAN_EDUCATIONS[ENGLISH_EDUCATIONS.indexOf(education)];
}