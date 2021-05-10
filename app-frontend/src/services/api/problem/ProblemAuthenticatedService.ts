import apiAxios from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {API_PROBLEM_ABANDON_PATH} from "../../ApiPaths";

class ProblemAuthenticatedService {

    private constructor() {
    }

    static abandonProblem(problemId: number) {
        return apiAxios.get<Problem>(API_PROBLEM_ABANDON_PATH.replace("{0}", String(problemId)),
            {
                validateStatus: status => status === 200
            })
    }

}

export default ProblemAuthenticatedService;