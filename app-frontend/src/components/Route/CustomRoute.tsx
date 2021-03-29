import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import AuthenticationService from "../../services/api/AuthenticationService";

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

const PrivateRoute: React.FunctionComponent<RouteProps> = ({children, ...rest}) => {
    return (
        <CustomRoute {...rest} redirected={!AuthenticationService.isAuthenticated()} redirectPath="/login">
            {children}
        </CustomRoute>
    );
}

const AuthenticationRoute: React.FunctionComponent<RouteProps> = ({children, ...rest}) => {
    return (
        <CustomRoute {...rest} redirected={AuthenticationService.isAuthenticated()} redirectPath="/dashboard">
            {children}
        </CustomRoute>
    );
}

export {PrivateRoute, AuthenticationRoute};
