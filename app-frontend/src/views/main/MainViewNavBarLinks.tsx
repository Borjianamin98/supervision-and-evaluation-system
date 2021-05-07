import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import DashboardIcon from "@material-ui/icons/Dashboard";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewListIcon from '@material-ui/icons/ViewList';
import React from 'react';
import {UniversityIcon} from "../../assets/svg/UniversityIcon";
import ListItemLink from '../../components/List/ListItemLink';
import {Role} from "../../model/enum/role";
import AuthenticationService from "../../services/api/AuthenticationService";
import DashboardView from "../dashboard/DashboardView";
import ProblemCreateView from "../problem/create/ProblemCreateView";
import ProblemEdit from "../problem/edit/ProblemEdit";
import ProblemListView from "../problem/PorblemListView";
import ProfileView from "../ProfileView";
import SettingsView from "../SettingsView";
import FacultyListView from "../university/faculty/FacultyListView";
import UniversityListView from "../university/UniversityListView";
import {
    DASHBOARD_VIEW_PATH,
    FACULTY_LIST_PATH,
    PROBLEM_CREATE_VIEW_PATH,
    PROBLEM_OBSERVATION_PATH,
    PROFILE_VIEW_PATH,
    SETTINGS_VIEW_PATH,
    UNIVERSITY_LIST_PATH
} from "../ViewPaths";

interface navBarRouteInfo {
    path: string,
    name: string,
    exact?: boolean,
    icon: React.FunctionComponent,
    component: React.FunctionComponent
}

const dashboardRoutesInfo: navBarRouteInfo[] = [
    {
        path: DASHBOARD_VIEW_PATH,
        name: "داشبورد",
        exact: false,
        icon: DashboardIcon,
        component: DashboardView
    },
]

const problemRoutesInfo: navBarRouteInfo[] = [
    {
        path: PROBLEM_OBSERVATION_PATH,
        name: "پایان‌نامه‌ها (پروژه‌ها)",
        icon: ViewListIcon,
        component: ProblemListView,
    },
    {
        path: PROBLEM_CREATE_VIEW_PATH,
        name: "ایجاد پایان‌نامه‌ (پروژه)",
        icon: NoteAddIcon,
        component: ProblemCreateView,
    },
    {
        path: "/problem/newCreate",
        name: "ایجاد پایان‌نامه‌ جدید",
        icon: NoteAddIcon,
        component: ProblemEdit,
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

// Admin role views
const universityRoutesInfo: navBarRouteInfo[] = [
    {
        path: UNIVERSITY_LIST_PATH,
        name: "دانشگاه‌ها",
        icon: UniversityIcon,
        component: UniversityListView,
    },
    {
        path: FACULTY_LIST_PATH,
        name: "دانشکده‌ها",
        icon: SchoolIcon,
        component: FacultyListView,
    },
]

const allRoutesInfo: navBarRouteInfo[] = [
    ...dashboardRoutesInfo,
    ...problemRoutesInfo,
    ...managementRoutesInfo,
    ...universityRoutesInfo
];

const createListFromRoutesInfo = (routesInfo: navBarRouteInfo[], show: boolean) => {
    return (
        show ? (
            <React.Fragment>
                <List>
                    {routesInfo.map((value, index) =>
                        <ListItemLink
                            key={index}
                            dir="rtl"
                            to={value.path}
                            primary={value.name}
                            icon={React.createElement(value.icon, {})}
                        />
                    )}
                </List>
                <Divider component="li"/>
            </React.Fragment>
        ) : undefined
    )
}

const MainViewNavBarLinks: React.FunctionComponent = () => {
    const jwtPayloadRoles = AuthenticationService.getJwtPayloadRoles()!;

    return (
        <>
            {createListFromRoutesInfo(dashboardRoutesInfo, true)}
            {createListFromRoutesInfo(problemRoutesInfo, jwtPayloadRoles.includes(Role.STUDENT))}
            {createListFromRoutesInfo(universityRoutesInfo, jwtPayloadRoles.includes(Role.ADMIN))}
            {createListFromRoutesInfo(managementRoutesInfo, true)}
        </>
    );
}

export {allRoutesInfo}
export default MainViewNavBarLinks;