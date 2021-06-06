import {User} from "../User";

export interface Admin extends User, AdminSpecialInfo {
}

export interface AdminSpecialInfo {
}