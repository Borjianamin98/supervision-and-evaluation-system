import {ThemeProvider} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';
import React from 'react';
import {useQuery, useQueryClient} from 'react-query';
import {useParams} from "react-router-dom";
import {rtlTheme} from "../../App";
import LoadingGrid from "../../components/Grid/LoadingGrid";
import HomeRedirect from "../../components/Route/HomeRedirect";
import {browserHistory} from "../../config/browserHistory";
import {Problem} from "../../model/problem/problem";
import {ProblemState} from "../../model/problem/problemState";
import ProblemAuthenticatedService from "../../services/api/problem/ProblemAuthenticatedService";
import {DASHBOARD_VIEW_PATH} from "../ViewPaths";

function ProblemRequiredEntryPoint(Component: React.FunctionComponent<{ problem: Problem }>): React.FunctionComponent {
    const PROBLEM_NOT_FOUND_MESSAGE = "مسئله مربوطه یافت نشد.";
    const ILLEGAL_PROBLEM_ACCESS_BASED_ON_PERMISSIONS_MESSAGE = "دسترسی به مسئله مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد.";
    const ILLEGAL_PROBLEM_ACCESS_BASED_ON_STATE_MESSAGE = "دسترسی به مسئله مربوطه با توجه به نوع مسئله امکان‌پذیر نمی‌باشد.";

    // Define intermediate variable is necessary for es-lint (detect calling react-hooks inside functional component)
    const ComponentWithProblem: React.FunctionComponent = () => {
        const {enqueueSnackbar} = useSnackbar();
        const {problemId} = useParams<{ problemId: string }>();

        const queryClient = useQueryClient();
        const {
            data: problem,
            isLoading: isProblemLoading,
            isError: isProblemLoadingFailed
        } = useQuery(["problem", +problemId],
            () => ProblemAuthenticatedService.retrieveProblem(+problemId)
                .then(problem => {
                    if (problem.state !== ProblemState.IN_PROGRESS && problem.state !== ProblemState.COMPLETED) {
                        enqueueSnackbar(ILLEGAL_PROBLEM_ACCESS_BASED_ON_STATE_MESSAGE, {variant: "error"});
                        browserHistory.push(DASHBOARD_VIEW_PATH);
                    }
                    return Promise.resolve(problem);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            enqueueSnackbar(ILLEGAL_PROBLEM_ACCESS_BASED_ON_PERMISSIONS_MESSAGE, {variant: "error"});
                            browserHistory.push(DASHBOARD_VIEW_PATH);
                        } else if (error.response.status === 404) {
                            enqueueSnackbar(PROBLEM_NOT_FOUND_MESSAGE, {variant: "error"});
                            browserHistory.push(DASHBOARD_VIEW_PATH);
                        }
                    }
                    return Promise.reject(error);
                }), {
                keepPreviousData: true
            });

        if (!(+problemId)) {
            return <HomeRedirect message="دسترسی به صفحه مربوطه امکان‌پذیر نمی‌باشد."/>
        }

        if (isProblemLoading || isProblemLoadingFailed || !problem) {
            return <ThemeProvider theme={rtlTheme}>
                <LoadingGrid
                    isLoading={isProblemLoading}
                    isError={isProblemLoadingFailed || !problem}
                    onRetryClick={() => queryClient.invalidateQueries(["problem", +problemId])}
                />
            </ThemeProvider>
        }

        return <Component problem={problem}/>
    }

    return ComponentWithProblem;
}

export default ProblemRequiredEntryPoint;