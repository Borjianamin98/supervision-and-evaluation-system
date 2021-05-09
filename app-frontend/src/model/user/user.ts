import {Role} from "../enum/role";
import {PersonalInfo} from "./personalInfo";

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