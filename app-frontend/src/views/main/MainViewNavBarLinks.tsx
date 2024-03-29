import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DashboardIcon from "@material-ui/icons/Dashboard";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import ViewListIcon from '@material-ui/icons/ViewList';
import React from 'react';
import {UniversityIcon} from "../../assets/svg/UniversityIcon";
import ListItemLink from '../../components/List/ListItemLink';
import {Role} from "../../model/enum/role";
import AuthenticationService from "../../services/api/AuthenticationService";
import DashboardView from "../dashboard/DashboardView";
import NotificationListView from "../notification/NotificationListView";
import ProblemEdit from "../problem/edit/ProblemEdit";
import ProblemManagementView from "../problem/management/ProblemManagementView";
import ProblemListView from "../problem/PorblemListView";
import ProblemRequiredEntryPoint from "../problem/ProblemRequiredEntryPoint";
import ProblemScheduleView from "../problem/schedule/ProblemScheduleView";
import ProfileView from "../profile/ProfileView";
import MasterReportListView from "../report/master/MasterReportListView";
import MasterReportView from "../report/master/MasterReportView";
import MasterRequiredEntryPoint from "../report/MasterRequiredEntryPoint";
import FacultyListView from "../university/faculty/FacultyListView";
import UniversityListView from "../university/UniversityListView";
import {
    DASHBOARD_VIEW_PATH,
    FACULTY_LIST_VIEW_PATH,
    MASTER_REPORT_VIEW_PATH,
    NOTIFICATION_VIEW_PATH,
    PROBLEM_EDIT_VIEW_PATH,
    PROBLEM_LIST_VIEW_PATH,
    PROBLEM_MANAGEMENT_VIEW_PATH,
    PROBLEM_SCHEDULE_VIEW_PATH,
    PROFILE_VIEW_PATH,
    UNIVERSITY_LIST_VIEW_PATH
} from "../ViewPaths";

interface navBarRouteInfo {
    path: string,
    pathRegex?: RegExp,     // (Default is to match path completely)
    name: string,
    exact?: boolean,        // (Default: true)
    roles?: Role[],         // (Default: anyone)
    component: React.FunctionComponent,
    icon?: React.FunctionComponent,
}

const dashboardRoutesInfo: navBarRouteInfo[] = [
    {
        path: DASHBOARD_VIEW_PATH,
        name: "داشبورد",
        exact: false,
        component: DashboardView,
        icon: DashboardIcon
    },
]

const problemRoutesInfo: navBarRouteInfo[] = [
    {
        path: PROBLEM_LIST_VIEW_PATH,
        name: "پایان‌نامه‌ها (پروژه‌ها)",
        roles: [Role.STUDENT, Role.MASTER],
        component: ProblemListView,
        icon: ViewListIcon,
    },
    {
        path: PROBLEM_EDIT_VIEW_PATH,
        name: "پایان‌نامه‌ (پروژه)",
        roles: [Role.STUDENT],
        component: ProblemEdit,
        icon: NoteAddIcon,
    },
    {
        path: PROBLEM_MANAGEMENT_VIEW_PATH + "/:problemId",
        pathRegex: new RegExp(`^${PROBLEM_MANAGEMENT_VIEW_PATH}/[0-9]+$`),
        name: "مدیریت پایان‌نامه‌ (پروژه)",
        roles: [Role.STUDENT, Role.MASTER],
        component: ProblemRequiredEntryPoint(ProblemManagementView),
    },
    {
        path: PROBLEM_SCHEDULE_VIEW_PATH + "/:problemId",
        pathRegex: new RegExp(`^${PROBLEM_SCHEDULE_VIEW_PATH}/[0-9]+$`),
        name: "زمان‌بندی پایان‌نامه‌ (پروژه)",
        roles: [Role.STUDENT, Role.MASTER],
        component: ProblemRequiredEntryPoint(ProblemScheduleView),
    },
]

const universityRoutesInfo: navBarRouteInfo[] = [
    {
        path: UNIVERSITY_LIST_VIEW_PATH,
        name: "دانشگاه‌ها",
        roles: [Role.ADMIN],
        component: UniversityListView,
        icon: UniversityIcon,
    },
    {
        path: FACULTY_LIST_VIEW_PATH,
        name: "دانشکده‌ها",
        roles: [Role.ADMIN],
        component: FacultyListView,
        icon: SchoolIcon,
    },
]

const reportRoutesInfo: navBarRouteInfo[] = [
    {
        path: MASTER_REPORT_VIEW_PATH + "/:masterId",
        pathRegex: new RegExp(`^${MASTER_REPORT_VIEW_PATH}/[0-9]+$`),
        name: "اطلاعات استاد",
        roles: [Role.ADMIN],
        component: MasterRequiredEntryPoint(MasterReportView),
    },
    {
        path: MASTER_REPORT_VIEW_PATH,
        name: "گزارش اساتید",
        roles: [Role.ADMIN],
        component: MasterReportListView,
        icon: AssessmentIcon,
    },
]

const userRoutesInfo: navBarRouteInfo[] = [
    {
        path: NOTIFICATION_VIEW_PATH,
        name: "اطلاعیه‌ها",
        component: NotificationListView,
        icon: NotificationsIcon,
    },
    {
        path: PROFILE_VIEW_PATH,
        name: "حساب کاربری",
        component: ProfileView,
        icon: PersonIcon,
    },
]

const allRoutesInfo: navBarRouteInfo[] = [
    ...dashboardRoutesInfo,
    ...problemRoutesInfo,
    ...universityRoutesInfo,
    ...reportRoutesInfo,
    ...userRoutesInfo,
];

const createListFromRoutesInfo = (routesInfo: navBarRouteInfo[], authenticatedUserRole: Role) => {
    const candidateRoutes = routesInfo.filter(value => !value.roles ||
        value.roles.includes(authenticatedUserRole));
    return (
        candidateRoutes.length !== 0 ? (
            <React.Fragment>
                <List>
                    {candidateRoutes
                        .filter(value => value.icon !== undefined)
                        .map((value, index) =>
                            <ListItemLink
                                key={index}
                                dir="rtl"
                                to={value.path}
                                primary={value.name}
                                icon={React.createElement(value.icon!, {})}
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
            {createListFromRoutesInfo(reportRoutesInfo, jwtPayloadRole)}
            {createListFromRoutesInfo(userRoutesInfo, jwtPayloadRole)}
        </>
    );
}

export {allRoutesInfo}
export default MainViewNavBarLinks;