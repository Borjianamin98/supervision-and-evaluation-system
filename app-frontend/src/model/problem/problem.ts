import {Education} from "../enum/education";
import {PeerReview} from "../review/PeerReview";
import {ProblemReview} from "../review/ProblemReview";
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
    finalGrade: number,

    student: Student,
    supervisor: Master,
    referees: Master[],

    meetSchedule: MeetSchedule,
    problemReviews: ProblemReview[],
    peerReviews: PeerReview[],
}