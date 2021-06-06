import {Gender} from "../enum/gender";

export interface PersonalInfoSave {
    gender: Gender,
    telephoneNumber: string,
    email: string,
}