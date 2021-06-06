import {Faculty} from "../../university/faculty/faculty";
import {University} from "../../university/University";
import {User} from "../User";

export interface Master extends User, MasterSpecialInfo {
}

export interface MasterSpecialInfo {
    degree: string,

    university: University,
    faculty: Faculty,
}