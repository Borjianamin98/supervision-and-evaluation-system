import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemState} from "../../../model/problem/problemState";
import {API_PROBLEM_MASTER_ROOT_PATH} from "../../ApiPaths";

class ProblemMasterService {

    private constructor() {
    }

    static retrieveAssignedProblems(pageSize: number, page: number, problemState: ProblemState) {
        return apiAxios.get<Pageable<Problem>>(API_PROBLEM_MASTER_ROOT_PATH,
            {
                validateStatus: status => status === 200,
                params: {
                    size: pageSize,
                    page: page,
                    problemState: problemState,
                }
            })
    }
}

export default ProblemMasterService;