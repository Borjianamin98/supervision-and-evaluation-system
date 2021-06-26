import React from 'react';
import {Redirect, Switch, useRouteMatch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import browserHistory from "../../config/browserHistory";
import {Role} from "../../model/enum/role";
import AuthenticationService from "../../services/api/AuthenticationService";
import {LOGIN_VIEW_PATH} from "../ViewPaths";
import AdminDashboardView from "./AdminDashboardView";
import MasterDashboardView from "./MasterDashboardView";
import StudentDashboardView from "./StudentDashboardView";

const DashboardView: React.FunctionComponent = () => {
    const routeMatch = useRouteMatch();
    const [redirectPath, setRedirectPath] = React.useState("");
    const adminDashboardPath = `${routeMatch.url}/admin`;
    const masterDashboardPath = `${routeMatch.url}/master`;
    const studentDashboardPath = `${routeMatch.url}/student`;

    React.useEffect(() => {
        AuthenticationService.check()
            .then(() => {
                const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;
                switch (jwtPayloadRole) {
                    case Role.STUDENT:
                        setRedirectPath(studentDashboardPath);
                        break;
                    case Role.MASTER:
                        setRedirectPath(masterDashboardPath);
                        break;
                    case Role.ADMIN:
                        setRedirectPath(adminDashboardPath);
                        break;
                    default:
                        throw new Error("Invalid user role: " + jwtPayloadRole)
                }
            })
            .catch(() => {
                // Invalid JWT token provided for authentication
                AuthenticationService.logout();
                browserHistory.push(LOGIN_VIEW_PATH);
            })
    }, [adminDashboardPath, masterDashboardPath, studentDashboardPath]);

    return (
        <Switch>
            <PrivateRoute path={adminDashboardPath}>
                <AdminDashboardView/>
            </PrivateRoute>
            <PrivateRoute path={masterDashboardPath}>
                <MasterDashboardView/>
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