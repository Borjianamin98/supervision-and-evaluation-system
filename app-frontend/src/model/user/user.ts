import {Role} from "../enum/role";
import {Master} from "./master";
import {PersonalInfo} from "./personalInfo";
import {Student} from "./student";

export interface User {
    id?: number,
    firstName: string,
    lastName: string,
    fullName?: string,
    username: string,
    password?: string,
    role?: Role,
    personalInfo?: PersonalInfo,
}

export interface UserCheck {
    username: string,
    available?: boolean,
}

export const userRoleInfo = (user: User) => {
    switch (user.role) {
        case Role.STUDENT:
            const studentUser = user as Student;
            return `دانشجوی ${studentUser.facultyName} دانشگاه ${studentUser.universityName}`;
        case Role.MASTER:
            const masterUser = user as Master;
            return `استاد ${masterUser.facultyName} دانشگاه ${masterUser.universityName}`;
        case Role.ADMIN:
            return "مدیر";
        default:
            throw new Error("Unexpected user role: " + user.role)
    }
}