import {browserHistory} from "../../config/browserHistory";
import {ProblemState} from "../../model/problem/problemState";
import ProblemAuthenticatedService from "../../services/api/problem/ProblemAuthenticatedService";
import {EnqueueSnackbar} from "../../types/notistack";
import {DASHBOARD_VIEW_PATH} from "../ViewPaths";

export default class ProblemSharedFunctions {

    private constructor() {
    }

    static illegalAccessHandler(enqueueSnackbar: EnqueueSnackbar, message?: string) {
        enqueueSnackbar(message ?? `دسترسی به مسئله مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد.`,
            {variant: "error"});
        browserHistory.push(DASHBOARD_VIEW_PATH);
    }

    static retrieveProblemForView(enqueueSnackbar: EnqueueSnackbar, problemId: number) {
        return ProblemAuthenticatedService.retrieveProblem(problemId)
            .then(problem => {
                if (problem.state !== ProblemState.IN_PROGRESS && problem.state !== ProblemState.COMPLETED) {
                    ProblemSharedFunctions.illegalAccessHandler(enqueueSnackbar,
                        "دسترسی به مسئله مربوطه با توجه به نوع مسئله امکان‌پذیر نمی‌باشد.");
                }
                return Promise.resolve(problem);
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        ProblemSharedFunctions.illegalAccessHandler(enqueueSnackbar);
                    } else if (error.response.status === 404) {
                        ProblemSharedFunctions.illegalAccessHandler(enqueueSnackbar,
                            "مسئله مربوطه یافت نشد.")
                    }
                }
                return Promise.reject(error);
            })
    }

}
