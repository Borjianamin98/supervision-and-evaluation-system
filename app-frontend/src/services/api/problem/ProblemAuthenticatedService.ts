import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemEvent} from "../../../model/problem/problemEvent";
import {API_PROBLEM_ABANDON_PATH, API_PROBLEM_EVENTS_PATH, API_SELECTED_PROBLEM_PATH} from "../../ApiPaths";

class ProblemAuthenticatedService {

    private constructor() {
    }

    static retrieveProblem(problemId: number) {
        return apiAxios.get<Problem>(API_SELECTED_PROBLEM_PATH.replace("{0}", String(problemId)))
            .then(response => response.data);
    }

    static retrieveProblemEvents(pageSize: number, page: number, problemId: number,
                                 sortBy?: string, sortDirection?: "asc" | "desc") {
        return apiAxios.get<Pageable<ProblemEvent>>(API_PROBLEM_EVENTS_PATH.replace("{0}", String(problemId)),
            {
                params: {
                    size: pageSize,
                    page: page,
                    sort: sortBy ? (sortDirection ? `${sortBy},${sortDirection}` : sortBy) : undefined,
                }
            }).then(response => response.data);
    }

    static abandonProblem(problemId: number) {
        return apiAxios.get<Problem>(API_PROBLEM_ABANDON_PATH.replace("{0}", String(problemId)))
            .then(response => response.data);
    }

}

export default ProblemAuthenticatedService;