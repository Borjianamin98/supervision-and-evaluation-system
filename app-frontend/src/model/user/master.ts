import {User} from "./user";

export interface Master extends User, MasterSpecialInfo {
}

export interface MasterSpecialInfo {
    degree: string,
}

// Model used to register a master in server
export interface MasterRegister {
    master: Master,
    facultyId: number
}