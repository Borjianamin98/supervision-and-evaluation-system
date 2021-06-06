import {Role} from "../enum/role";
import {Master} from "./master/Master";
import {PersonalInfo} from "./PersonalInfo";
import {Student} from "./student/Student";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    fullName: string,
    username: string,
    role: Role,
    personalInfo: PersonalInfo,
}

export const userRoleInfo = (user: User) => {
    switch (user.role) {
        case Role.STUDENT:
            const studentUser = user as Student;
            return `دانشجوی ${studentUser.faculty.name} دانشگاه ${studentUser.university.name}`;
        case Role.MASTER:
            const masterUser = user as Master;
            return `استاد ${masterUser.faculty.name} دانشگاه ${masterUser.university.name}`;
        case Role.ADMIN:
            return "مدیر";
        default:
            throw new Error("Unexpected user role: " + user.role)
    }
}