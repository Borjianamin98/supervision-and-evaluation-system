import {Education} from "../enum/education";
import {MeetSchedule} from "../schedule/MeetSchedule";
import {Master} from "../user/master";
import {Student} from "../user/student";
import {ProblemState} from "./problemState";

export interface Problem {
    id?: number,

    education: Education,

    title: string,
    englishTitle: string,
    keywords: string[],

    definition: string,
    history: string,
    considerations: string,

    state: ProblemState,

    student?: Student,
    supervisor?: Master,
    referees: Master[],

    meetSchedule?: MeetSchedule,
}