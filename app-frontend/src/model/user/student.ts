import {User} from "./user";

export interface Student extends User, StudentSpecialInfo {
}

export interface StudentSpecialInfo {
    studentNumber: string,
}