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

    React.useEffect(() => {
        AuthenticationService.check()
            .catch(reason => {
                // Invalid JWT token provided for authentication
                AuthenticationService.logout();
                browserHistory.push(LOGIN_VIEW_PATH);
            })
    }, []);

    const jwtPayloadRoles = AuthenticationService.getJwtPayloadRoles()!;
    const adminDashboardPath = `${routeMatch.url}/admin`;
    const masterDashboardPath = `${routeMatch.url}/master`;
    const studentDashboardPath = `${routeMatch.url}/student`;
    let redirectPath: string;
    if (jwtPayloadRoles.includes(Role.STUDENT)) {
        redirectPath = studentDashboardPath;
    } else if (jwtPayloadRoles.includes(Role.MASTER)) {
        redirectPath = masterDashboardPath;
    } else if (jwtPayloadRoles.includes(Role.ADMIN)) {
        redirectPath = adminDashboardPath;
    } else {
        throw new Error("Invalid user roles: " + jwtPayloadRoles)
    }

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
                <Redirect to={redirectPath}/>
            </PrivateRoute>
        </Switch>
    );
}

export default DashboardView;