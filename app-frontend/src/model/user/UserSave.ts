import {PersonalInfoSave} from "./PersonalInfoSave";

export interface UserSave {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    personalInfo: PersonalInfoSave,
}