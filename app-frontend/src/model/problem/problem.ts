import {Education} from "../enum/education";
import {MeetSchedule} from "../schedule/MeetSchedule";
import {Master} from "../user/master/Master";
import {Student} from "../user/student/Student";
import {ProblemState} from "./problemState";

export interface ProblemSave {
    education: Education,
    title: string,
    englishTitle: string,
    keywords: string[],
    definition: string,
    history: string,
    considerations: string,
    supervisorId?: number,
}

export interface Problem {
    id: number,
    education: Education,
    title: string,
    englishTitle: string,
    keywords: string[],
    definition: string,
    history: string,
    considerations: string,
    state: ProblemState,

    student: Student,
    supervisor: Master,
    referees: Master[],
    meetSchedule: MeetSchedule,
}