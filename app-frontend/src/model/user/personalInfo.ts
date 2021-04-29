import {Gender} from "../enum/gender";

export interface PersonalInfo {
    id?: number,
    gender: Gender,
    telephoneNumber: string,
    email: string,
}