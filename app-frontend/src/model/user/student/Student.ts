import {Faculty} from "../../university/faculty/faculty";
import {University} from "../../university/University";
import {User} from "../User";

export interface Student extends User, StudentSpecialInfo {
}

export interface StudentSpecialInfo {
    studentNumber: string,

    university: University,
    faculty: Faculty,
}