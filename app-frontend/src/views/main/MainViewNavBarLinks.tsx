import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import DashboardIcon from "@material-ui/icons/Dashboard";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewListIcon from '@material-ui/icons/ViewList';
import React from 'react';
import ListItemLink from '../../components/List/ListItemLink';
import DashboardView from "../DashboardView";
import ProblemCreateView from "../problem/create/ProblemCreateView";
import ProblemView from "../problem/ProblemView";
import ProfileView from "../ProfileView";
import SettingsView from "../SettingsView";
import {
    DASHBOARD_VIEW_PATH,
    PROBLEM_CREATE_VIEW_PATH,
    PROBLEM_VIEW_PATH,
    PROFILE_VIEW_PATH,
    SETTINGS_VIEW_PATH
} from "../ViewPaths";

interface navBarRouteInfo {
    path: string,
    name: string,
    icon: React.FunctionComponent,
    component: React.FunctionComponent
}

const dashboardRoutesInfo: navBarRouteInfo[] = [
    {
        path: DASHBOARD_VIEW_PATH,
        name: "داشبورد",
        icon: DashboardIcon,
        component: DashboardView
    },
]

const problemRoutesInfo: navBarRouteInfo[] = [
    {
        path: PROBLEM_VIEW_PATH,
        name: "مسئله‌ها",
        icon: ViewListIcon,
        component: ProblemView,
    },
    {
        path: PROBLEM_CREATE_VIEW_PATH,
        name: "ایجاد مسئله",
        icon: NoteAddIcon,
        component: ProblemCreateView,
    },
]

const managementRoutesInfo: navBarRouteInfo[] = [
    {
        path: PROFILE_VIEW_PATH,
        name: "حساب کاربری",
        icon: PersonIcon,
        component: ProfileView,
    },
    {
        path: SETTINGS_VIEW_PATH,
        name: "تنظیمات",
        icon: SettingsIcon,
        component: SettingsView,
    },
]

const allRoutesInfo: navBarRouteInfo[] = [
    ...dashboardRoutesInfo,
    ...problemRoutesInfo,
    ...managementRoutesInfo,
];

const MainViewNavBarLinks: React.FunctionComponent = () => {
    const createListFromRoutesInfo = (routesInfo: navBarRouteInfo[]) => {
        return <List>
            {routesInfo.map((value, index) =>
                <ListItemLink
                    key={index}
                    dir="rtl"
                    to={value.path}
                    primary={value.name}
                    icon={React.createElement(value.icon, {})}
                />)}
        </List>
    }

    return (
        <>
            {createListFromRoutesInfo(dashboardRoutesInfo)}
            <Divider component="li"/>
            {createListFromRoutesInfo(problemRoutesInfo)}
            <Divider component="li"/>
            {createListFromRoutesInfo(managementRoutesInfo)}
            <Divider component="li"/>
        </>
    );
}

export {allRoutesInfo}
export default MainViewNavBarLinks;