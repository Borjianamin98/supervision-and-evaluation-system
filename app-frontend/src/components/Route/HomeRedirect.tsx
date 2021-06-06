import {useSnackbar} from "notistack";
import React from "react";
import {Redirect, useLocation} from "react-router-dom";
import {DASHBOARD_VIEW_PATH} from "../../views/ViewPaths";

interface HomeRedirectProps {
    message: string,
}

function HomeRedirect(props: HomeRedirectProps) {
    const {enqueueSnackbar} = useSnackbar();
    const location = useLocation();
    const {message} = props;

    React.useEffect(() => {
        enqueueSnackbar(message, {variant: "error"});
    }, [enqueueSnackbar, message])

    return <Redirect
        to={{
            pathname: DASHBOARD_VIEW_PATH,
            state: {from: location}
        }}
    />
}

export default HomeRedirect;
