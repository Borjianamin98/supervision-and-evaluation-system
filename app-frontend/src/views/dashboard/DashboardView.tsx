import React from 'react';
import {Redirect, Switch, useRouteMatch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import browserHistory from "../../config/browserHistory";
import {Role} from "../../model/enum/role";
import AuthenticationService from "../../services/api/AuthenticationService";
import {LOGIN_VIEW_PATH} from "../ViewPaths";
import StudentDashboardView from "./StudentDashboardView";

const DashboardView: React.FunctionComponent = () => {
    const routeMatch = useRouteMatch();
    const [redirectPath, setRedirectPath] = React.useState("");
    const adminDashboardPath = `${routeMatch.url}/admin`;
    const masterDashboardPath = `${routeMatch.url}/master`;
    const studentDashboardPath = `${routeMatch.url}/student`;

    React.useEffect(() => {
        AuthenticationService.check()
            .then(value => {
                const jwtPayloadRoles = AuthenticationService.getJwtPayloadRoles()!;
                if (jwtPayloadRoles.includes(Role.STUDENT)) {
                    setRedirectPath(studentDashboardPath);
                } else if (jwtPayloadRoles.includes(Role.MASTER)) {
                    setRedirectPath(masterDashboardPath);
                } else if (jwtPayloadRoles.includes(Role.ADMIN)) {
                    setRedirectPath(adminDashboardPath);
                } else {
                    throw new Error("Invalid user roles: " + jwtPayloadRoles)
                }
            })
            .catch(reason => {
                // Invalid JWT token provided for authentication
                AuthenticationService.logout();
                browserHistory.push(LOGIN_VIEW_PATH);
            })
    }, [adminDashboardPath, masterDashboardPath, studentDashboardPath]);

    return (
        <Switch>
            <PrivateRoute path={adminDashboardPath}>
            </PrivateRoute>
            <PrivateRoute path={masterDashboardPath}>
            </PrivateRoute>
            <PrivateRoute path={studentDashboardPath}>
                <StudentDashboardView/>
            </PrivateRoute>
            <PrivateRoute path={`${routeMatch.path}`}>
                {redirectPath.length > 0 ? <Redirect to={redirectPath}/> : undefined}
            </PrivateRoute>
        </Switch>
    );
}

export default DashboardView;