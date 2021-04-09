import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import React from 'react';
import {Switch, useRouteMatch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import DashboardView from "../DashboardView";
import ProfileView from '../ProfileView';
import SettingsView from "../SettingsView";

const mainRoutes = [
    {
        path: "/",
        name: "داشبورد",
        icon: DashboardIcon,
        component: DashboardView
    },
    {
        path: "/user",
        name: "حساب کاربری",
        icon: PersonIcon,
        component: ProfileView,
    },
    {
        path: "/settings",
        name: "تنظیمات",
        icon: SettingsIcon,
        component: SettingsView,
    },
];

const MainViewContent: React.FunctionComponent = () => {
    const routeMatch = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={routeMatch.path}>
                <DashboardView/>
            </PrivateRoute>
            <PrivateRoute exact path={`${routeMatch.path}/setting`}>
                <SettingsView/>
            </PrivateRoute>
        </Switch>
    );
}

export default MainViewContent;