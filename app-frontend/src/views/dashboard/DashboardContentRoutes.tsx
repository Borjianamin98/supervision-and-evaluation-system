import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {AxiosResponse} from "axios";
import React, {useEffect, useState} from 'react';
import {Switch, useLocation, useRouteMatch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import apiAxios from "../../config/axios-config";
import {API_USER_PATH} from "../../services/ApiPaths";

interface User {
    username: string
}

interface UserApiResponse {
    users: Array<User>
}

const DashboardView: React.FunctionComponent = () => {
    const routeMatch = useRouteMatch();
    const location = useLocation();

    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        apiAxios.get<UserApiResponse, AxiosResponse<UserApiResponse>>(API_USER_PATH)
            .then(value => setUsers(value.data.users))
            .catch(err => console.log("error"));
    }, [location.key])

    return (
        <Switch>
            <PrivateRoute exact path={routeMatch.path}>
                <div>
                    <Typography paragraph>
                        نام کاربران که به صورت امتحانی صرفا دریافت شده و نمایش داده شده است:
                    </Typography>
                    <List>
                        {
                            users.map(u => <ListItem dir="rtl" key={u.username}>
                                <ListItemText primary={u.username}/>
                            </ListItem>)
                        }
                    </List>
                </div>
            </PrivateRoute>
            <PrivateRoute path={`${routeMatch.path}/setting`}>
                <Typography paragraph>
                    صفحه تنظیمات
                </Typography>
            </PrivateRoute>
        </Switch>
    );
}

export default DashboardView;