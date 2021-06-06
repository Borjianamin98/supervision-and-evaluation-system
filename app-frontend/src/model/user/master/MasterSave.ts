import {UserSave} from "../UserSave";

export interface MasterSave extends UserSave, MasterSaveSpecialInfo {
}

export interface MasterSaveSpecialInfo {
    degree: string,
    facultyId: number
}