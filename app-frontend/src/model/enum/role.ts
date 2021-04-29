export enum Role {
    STUDENT = "ROLE_STUDENT",
    MASTER = "ROLE_MASTER",
    ADMIN = "ROLE_ADMIN"
}

export const PERSIAN_ROLES = [
    "دانشجو",
    "استاد",
    "مدیر"
];

export const ENGLISH_ROLES = [
    Role.STUDENT,
    Role.MASTER,
    Role.ADMIN,
];

export const roleMapToEnglish = (role: string) => {
    return ENGLISH_ROLES[PERSIAN_ROLES.indexOf(role)];
}

export const roleMapToPersian = (role: Role) => {
    return PERSIAN_ROLES[ENGLISH_ROLES.indexOf(role)];
}