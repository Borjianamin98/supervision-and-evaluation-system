import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/api/Pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemEvent} from "../../../model/problem/problemEvent";
import {API_PROBLEM_ROOT_PATH} from "../../ApiPaths";

class ProblemAuthenticatedService {

    private constructor() {
    }

    static retrieveProblem(problemId: number) {
        return apiAxios.get<Problem>(`${API_PROBLEM_ROOT_PATH}/${problemId}`)
            .then(response => response.data);
    }

    static retrieveProblemEvents(pageSize: number, page: number, problemId: number,
                                 sortBy?: string, sortDirection?: "asc" | "desc") {
        return apiAxios
            .get<Pageable<ProblemEvent>>(`${API_PROBLEM_ROOT_PATH}/${problemId}/events`,
                {
                    params: {
                        size: pageSize,
                        page: page,
                        sortBy: sortBy ? (sortDirection ? `${sortBy},${sortDirection}` : sortBy) : undefined,
                    }
                })
            .then(response => response.data);
    }

    static abandonProblem(problemId: number) {
        return apiAxios.get<Problem>(`${API_PROBLEM_ROOT_PATH}/${problemId}/abandon`)
            .then(response => response.data);
    }

}

export default ProblemAuthenticatedService;