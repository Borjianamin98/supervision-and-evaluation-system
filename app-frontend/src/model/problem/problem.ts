import {Education} from "../enum/education";
import {Master} from "../user/master";
import {Student} from "../user/student";
import {ProblemEvent} from "./problemEvent";
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
    events: ProblemEvent[],

    student?: Student,
    supervisor?: Master,
    referees: Master[],
}