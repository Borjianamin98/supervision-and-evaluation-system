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
import ProblemEdit from "../problem/edit/ProblemEdit";
import ProblemListView from "../problem/PorblemListView";
import ProfileView from "../ProfileView";
import SettingsView from "../SettingsView";
import FacultyListView from "../university/faculty/FacultyListView";
import UniversityListView from "../university/UniversityListView";
import {
    DASHBOARD_VIEW_PATH,
    FACULTY_LIST_VIEW_PATH,
    PROBLEM_EDIT_VIEW_PATH,
    PROBLEM_LIST_VIEW_PATH,
    PROFILE_VIEW_PATH,
    SETTINGS_VIEW_PATH,
    UNIVERSITY_LIST_VIEW_PATH
} from "../ViewPaths";

interface navBarRouteInfo {
    path: string,
    name: string,
    exact?: boolean, // Default is true
    roles?: Role[], // Default is anyone
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
        path: PROBLEM_LIST_VIEW_PATH,
        name: "پایان‌نامه‌ها (پروژه‌ها)",
        roles: [Role.STUDENT, Role.MASTER],
        icon: ViewListIcon,
        component: ProblemListView,
    },
    {
        path: PROBLEM_EDIT_VIEW_PATH,
        name: "ایجاد پایان‌نامه‌ (پروژه)",
        roles: [Role.STUDENT],
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
        path: UNIVERSITY_LIST_VIEW_PATH,
        name: "دانشگاه‌ها",
        roles: [Role.ADMIN],
        icon: UniversityIcon,
        component: UniversityListView,
    },
    {
        path: FACULTY_LIST_VIEW_PATH,
        name: "دانشکده‌ها",
        roles: [Role.ADMIN],
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

const createListFromRoutesInfo = (routesInfo: navBarRouteInfo[], authenticatedUserRole: Role) => {
    const candidateRoutes = routesInfo.filter(value => !value.roles ||
        value.roles.includes(authenticatedUserRole));
    return (
        candidateRoutes.length !== 0 ? (
            <React.Fragment>
                <List>
                    {candidateRoutes.map((value, index) =>
                        <ListItemLink
                            key={index}
                            dir="rtl"
                            to={value.path}
                            primary={value.name}
                            icon={React.createElement(value.icon, {})}
                        />
                    )}
                </List>
                <Divider/>
            </React.Fragment>
        ) : undefined
    )
}

const MainViewNavBarLinks: React.FunctionComponent = () => {
    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;

    return (
        <>
            {createListFromRoutesInfo(dashboardRoutesInfo, jwtPayloadRole)}
            {createListFromRoutesInfo(problemRoutesInfo, jwtPayloadRole)}
            {createListFromRoutesInfo(universityRoutesInfo, jwtPayloadRole)}
            {createListFromRoutesInfo(managementRoutesInfo, jwtPayloadRole)}
        </>
    );
}

export {allRoutesInfo}
export default MainViewNavBarLinks;