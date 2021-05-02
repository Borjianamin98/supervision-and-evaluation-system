import {User} from "./user";

export interface Admin extends User, AdminSpecialInfo {
}

export interface AdminSpecialInfo {
}