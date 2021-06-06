import {UserSave} from "../UserSave";

export interface StudentSave extends UserSave, StudentSaveSpecialInfo {
}

export interface StudentSaveSpecialInfo {
    studentNumber: string,
    facultyId: number,
}