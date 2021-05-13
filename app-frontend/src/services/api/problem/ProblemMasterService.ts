import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemEvent} from "../../../model/problem/problemEvent";
import {ProblemState} from "../../../model/problem/problemState";
import {
    API_PROBLEM_MASTER_COMMENT_ON_PROBLEM_PATH,
    API_PROBLEM_MASTER_INITIAL_APPROVE_OF_PROBLEM_PATH,
    API_PROBLEM_MASTER_ROOT_PATH
} from "../../ApiPaths";

class ProblemMasterService {

    private constructor() {
    }

    static retrieveAssignedProblems(pageSize: number, page: number, problemState: ProblemState) {
        return apiAxios.get<Pageable<Problem>>(API_PROBLEM_MASTER_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    problemState: problemState,
                }
            }).then(response => response.data);
    }

    static placeCommentOnProblem(problemId: number, problemEvent: ProblemEvent) {
        return apiAxios.post<ProblemEvent>(API_PROBLEM_MASTER_COMMENT_ON_PROBLEM_PATH.replace("{0}", String(problemId)),
            problemEvent).then(response => response.data);
    }

    static initialApprovalOfProblem(problemId: number) {
        return apiAxios.get<Problem>(API_PROBLEM_MASTER_INITIAL_APPROVE_OF_PROBLEM_PATH.replace("{0}", String(problemId)))
            .then(response => response.data);
    }
}

export default ProblemMasterService;