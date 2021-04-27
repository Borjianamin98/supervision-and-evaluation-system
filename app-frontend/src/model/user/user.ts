import {University} from "../university/university";
import {PersonalInfo} from "./personalInfo";

export interface User {
    id?: number,
    firstName: string,
    lastName: string,
    username: string,
    password?: string,
    personalInfo?: PersonalInfo,
}