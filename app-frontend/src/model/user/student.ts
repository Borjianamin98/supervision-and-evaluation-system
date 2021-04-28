import {User} from "./user";

export interface Student extends User, StudentSpecialInfo {
}

export interface StudentSpecialInfo {
    studentNumber: string,
}

// Model used to register a student in server
export interface StudentRegister {
    student: Student,
    facultyId: number
}