import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import ListItemLink from '../../components/List/ListItemLink';
import DashboardView from "../DashboardView";
import ProfileView from "../ProfileView";
import SettingsView from "../SettingsView";
import {DASHBOARD_VIEW_PATH, PROFILE_VIEW_PATH, SETTINGS_VIEW_PATH} from "../ViewPaths";

const navBarRoutesInfo = [
    {
        path: DASHBOARD_VIEW_PATH,
        name: "داشبورد",
        icon: DashboardIcon,
        component: DashboardView
    },
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
];

const MainViewNavBarLinks: React.FunctionComponent = () => {
    return (
        <>
            <List>
                {navBarRoutesInfo.map((value, index) =>
                    <ListItemLink
                        key={index}
                        dir="rtl"
                        to={value.path}
                        primary={value.name}
                        icon={React.createElement(value.icon, {})}
                    />)}
            </List>
            <Divider/>

        </>
    );
}

export {navBarRoutesInfo}
export default MainViewNavBarLinks;