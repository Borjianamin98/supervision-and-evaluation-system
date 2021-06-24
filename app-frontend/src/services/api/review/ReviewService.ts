import apiAxios from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {ProblemReviewSave} from "../../../model/review/ProblemReviewSave";

class ReviewService {

    private static readonly API_REVIEW_ROOT_PATH = "/review"

    private constructor() {
    }

    static reviewProblem(problemId: number, problemReviewSave: ProblemReviewSave) {
        return apiAxios
            .post<Problem>(`${ReviewService.API_REVIEW_ROOT_PATH}/${problemId}`, problemReviewSave)
            .then(response => response.data)
    }

    static finalizeProblemReview(problemId: number, finalGrade: number) {
        return apiAxios
            .post<Problem>(`${ReviewService.API_REVIEW_ROOT_PATH}/${problemId}/finalize`, {},
                {
                    params: {
                        finalGrade,
                    }
                })
            .then(response => response.data)
    }

}

export default ReviewService;