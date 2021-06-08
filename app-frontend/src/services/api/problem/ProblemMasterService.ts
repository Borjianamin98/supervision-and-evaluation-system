import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemEvent, ProblemEventSave} from "../../../model/problem/problemEvent";
import {ProblemState} from "../../../model/problem/problemState";
import {API_PROBLEM_ROOT_PATH} from "../../ApiPaths";

class ProblemMasterService {

    private static readonly API_PROBLEM_MASTER_ROOT_PATH = `${API_PROBLEM_ROOT_PATH}/authenticatedMaster`

    private constructor() {
    }

    static retrieveAssignedProblems(pageSize: number, page: number, problemState: ProblemState) {
        return apiAxios.get<Pageable<Problem>>(ProblemMasterService.API_PROBLEM_MASTER_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    problemState: problemState,
                }
            }).then(response => response.data);
    }

    static addProblemEvent(problemId: number, problemEventSave: ProblemEventSave) {
        return apiAxios.post<ProblemEvent>(`${API_PROBLEM_ROOT_PATH}/${problemId}/events`,
            problemEventSave).then(response => response.data);
    }

    static initialApprovalOfProblem(problemId: number) {
        return apiAxios.get<Problem>(`${ProblemMasterService.API_PROBLEM_MASTER_ROOT_PATH}/${problemId}/initialApprove`)
            .then(response => response.data);
    }

    static addReferee(problemId: number, refereeId: number) {
        return apiAxios.post<Problem>(
            `${ProblemMasterService.API_PROBLEM_MASTER_ROOT_PATH}/${problemId}/referee/${refereeId}`)
            .then(response => response.data);
    }

    static removeReferee(problemId: number, refereeId: number) {
        return apiAxios.delete<Problem>(
            `${ProblemMasterService.API_PROBLEM_MASTER_ROOT_PATH}/${problemId}/referee/${refereeId}`)
            .then(response => response.data);
    }
}

export default ProblemMasterService;