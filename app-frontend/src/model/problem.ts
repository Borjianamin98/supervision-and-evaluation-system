import {Education} from "./enum/education";
import {ProblemState} from "./enum/problem/problem-state";
import {Master} from "./user/master";

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

    supervisor?: Master,
}