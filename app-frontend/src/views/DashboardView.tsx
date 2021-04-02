import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import AuthenticationService from '../services/api/AuthenticationService';
import SettingView from "./SettingView";
import {Switch, Link, useRouteMatch, useLocation} from "react-router-dom"
import {PrivateRoute} from "../components/Route/CustomRoute";
import apiAxios from "../config/axios-config";
import {API_USER_PATH} from "../services/ApiPaths";
import {AxiosResponse} from "axios";
import Dashboard from "./Dashboard";

interface User {
    username: string
}

interface UserApiResponse {
    users: Array<User>
}

const DashboardView: React.FunctionComponent = () => {
    const match = useRouteMatch();
    const location = useLocation()
    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        apiAxios.get<UserApiResponse, AxiosResponse<UserApiResponse>>(API_USER_PATH)
            .then(value => setUsers(value.data.users))
            .catch(err => console.log("error"));
    }, [location.key])

    return (
        <Switch>
            <PrivateRoute exact path={match.path}>
                <>
                    <p>Page Dashboard</p>
                    <ul>
                        {users.map(u => <li key={u.username}>{u.username}</li>)}
                    </ul>
                    <Link to={`${match.url}/setting`}>Go Setting</Link>
                    <Button variant="contained" onClick={() => AuthenticationService.logout()}>Log out!</Button>
                </>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}/dv`}>
                <Dashboard/>
            </PrivateRoute>
            <PrivateRoute path={`${match.path}/setting`}>
                <SettingView/>
            </PrivateRoute>
        </Switch>
    );
}

export default DashboardView;