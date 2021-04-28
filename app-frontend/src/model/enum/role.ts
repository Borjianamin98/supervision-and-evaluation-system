export const PERSIAN_ROLES = [
    "دانشجو",
    "استاد",
];

export const ENGLISH_ROLES = [
    "STUDENT",
    "MASTER",
];

export const roleMapToEnglish = (role: string) => {
    return ENGLISH_ROLES[PERSIAN_ROLES.indexOf(role)];
}

export const roleMapToPersian = (role: string) => {
    return PERSIAN_ROLES[ENGLISH_ROLES.indexOf(role)];
}