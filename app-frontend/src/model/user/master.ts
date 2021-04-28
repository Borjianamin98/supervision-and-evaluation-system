import {User} from "./user";

export interface Master extends User, MasterSpecialInfo {
}

export interface MasterSpecialInfo {
    degree: string,
}