import {ThemeProvider} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';
import React from 'react';
import {useQuery, useQueryClient} from 'react-query';
import {useParams} from "react-router-dom";
import {rtlTheme} from "../../App";
import LoadingGrid from "../../components/Grid/LoadingGrid";
import HomeRedirect from "../../components/Route/HomeRedirect";
import {browserHistory} from "../../config/browserHistory";
import {Master} from "../../model/user/master/Master";
import MasterService from "../../services/api/user/MasterService";
import {DASHBOARD_VIEW_PATH} from "../ViewPaths";

function MasterRequiredEntryPoint(Component: React.FunctionComponent<{ master: Master }>): React.FunctionComponent {
    const MASTER_NOT_FOUND_MESSAGE = "اطلاعات استاد مربوطه یافت نشد.";
    const ILLEGAL_MASTER_ACCESS_BASED_ON_PERMISSIONS_MESSAGE = "دسترسی به اطلاعات استاد مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد.";

    // Define intermediate variable is necessary for es-lint (detect calling react-hooks inside functional component)
    const ComponentWithMaster: React.FunctionComponent = () => {
        const {enqueueSnackbar} = useSnackbar();
        const {masterId} = useParams<{ masterId: string }>();

        const queryClient = useQueryClient();
        const {
            data: master,
            isLoading: isMasterLoading,
            isError: isMasterLoadingFailed
        } = useQuery(["master", +masterId],
            () => MasterService.retrieveMaster(+masterId)
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            enqueueSnackbar(ILLEGAL_MASTER_ACCESS_BASED_ON_PERMISSIONS_MESSAGE, {variant: "error"});
                            browserHistory.push(DASHBOARD_VIEW_PATH);
                        } else if (error.response.status === 404) {
                            enqueueSnackbar(MASTER_NOT_FOUND_MESSAGE, {variant: "error"});
                            browserHistory.push(DASHBOARD_VIEW_PATH);
                        }
                    }
                    return Promise.reject(error);
                }), {
                keepPreviousData: true
            });

        if (!(+masterId)) {
            return <HomeRedirect message="دسترسی به صفحه مربوطه امکان‌پذیر نمی‌باشد."/>
        }

        if (isMasterLoading || isMasterLoading || !master) {
            return <ThemeProvider theme={rtlTheme}>
                <LoadingGrid
                    isLoading={isMasterLoading}
                    isError={isMasterLoadingFailed || !master}
                    onRetryClick={() => queryClient.invalidateQueries(["master", +masterId])}
                />
            </ThemeProvider>
        }

        return <Component master={master}/>
    }

    return ComponentWithMaster;
}

export default MasterRequiredEntryPoint;