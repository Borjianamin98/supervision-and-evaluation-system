export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export const PERSIAN_GENDERS = [
    "مرد",
    "زن",
];

export const ENGLISH_GENDERS = [
    Gender.MALE,
    Gender.FEMALE,
];

export const genderMapToEnglish = (gender: string) => {
    return ENGLISH_GENDERS[PERSIAN_GENDERS.indexOf(gender)];
}

export const genderMapToPersian = (gender: Gender) => {
    return PERSIAN_GENDERS[ENGLISH_GENDERS.indexOf(gender)];
}