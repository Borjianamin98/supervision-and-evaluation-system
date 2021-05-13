import apiAxios from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {API_PROBLEM_ABANDON_PATH, API_SELECTED_PROBLEM_PATH} from "../../ApiPaths";

class ProblemAuthenticatedService {

    private constructor() {
    }

    static retrieveProblem(problemId: number) {
        return apiAxios.get<Problem>(API_SELECTED_PROBLEM_PATH.replace("{0}", String(problemId)))
            .then(response => response.data)
    }

    static abandonProblem(problemId: number) {
        return apiAxios.get<Problem>(API_PROBLEM_ABANDON_PATH.replace("{0}", String(problemId)))
    }

}

export default ProblemAuthenticatedService;