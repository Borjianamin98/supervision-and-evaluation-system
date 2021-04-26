export const PERSIAN_GENDERS = [
    "مرد",
    "زن",
];

export const ENGLISH_GENDERS = [
    "MALE",
    "FEMALE",
];

export const genderMapToEnglish = (education: string) => {
    return ENGLISH_GENDERS[PERSIAN_GENDERS.indexOf(education)];
}

export const genderMapToPersian = (education: string) => {
    return PERSIAN_GENDERS[ENGLISH_GENDERS.indexOf(education)];
}