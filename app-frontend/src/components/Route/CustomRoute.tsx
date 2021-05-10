import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {Role} from "../../model/enum/role";
import AuthenticationService from "../../services/api/AuthenticationService";
import {DASHBOARD_VIEW_PATH, LOGIN_VIEW_PATH} from "../../views/ViewPaths";

interface CustomRouteProps extends RouteProps {
    redirected: boolean,
    redirectPath: string
}

// A wrapper for <Route> that redirects to the another page if specified.
const CustomRoute: React.FunctionComponent<CustomRouteProps> = ({redirected, redirectPath, children, ...rest}) => {
    return (
        <Route
            {...rest}
            render={({location}) =>
                redirected ? (
                    <Redirect
                        to={{
                            pathname: redirectPath,
                            state: {from: location}
                        }}
                    />
                ) : (
                    children
                )
            }
        />
    );
}

type AuthRouteProps = RouteProps & {
    accessRoles?: Role[],
}

const PrivateRoute: React.FunctionComponent<AuthRouteProps> = ({children, accessRoles, ...rest}) => {
    let redirectPath: string;
    if (AuthenticationService.isAuthenticated()) {
        const jwtRole = AuthenticationService.getJwtPayloadRole()!;
        if (!accessRoles || accessRoles.includes(jwtRole)) {
            redirectPath = "";
        } else {
            redirectPath = DASHBOARD_VIEW_PATH;
        }
    } else {
        redirectPath = LOGIN_VIEW_PATH;
    }
    return (
        <CustomRoute
            {...rest}
            redirected={redirectPath !== ""}
            redirectPath={redirectPath}
        >
            {children}
        </CustomRoute>
    );
}

const AuthenticationRoute: React.FunctionComponent<RouteProps> = ({children, ...rest}) => {
    return (
        <CustomRoute {...rest}
                     redirected={AuthenticationService.isAuthenticated()}
                     redirectPath={DASHBOARD_VIEW_PATH}
        >
            {children}
        </CustomRoute>
    );
}

export {PrivateRoute, AuthenticationRoute};
