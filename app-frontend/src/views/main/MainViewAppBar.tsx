import {Badge, IconButton, MenuItem, MenuList} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import {useQuery} from "react-query";
import {Link, useLocation} from "react-router-dom";
import PopperIconButton from "../../components/Popper/PopperIconButton";
import browserHistory from "../../config/browserHistory";
import AuthenticationService from "../../services/api/AuthenticationService";
import NotificationService from "../../services/api/notification/NotificationService";
import {NOTIFICATION_VIEW_PATH, PROFILE_VIEW_PATH} from "../ViewPaths";
import {allRoutesInfo} from "./MainViewNavBarLinks";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        dropdownItem: {
            display: "block",
            whiteSpace: "nowrap",
            textAlign: "center",
        }
    }),
);

const MainViewAppBar: React.FunctionComponent = () => {
    const classes = useStyles();
    const [pageTitle, setPageTitle] = React.useState("");

    const location = useLocation();
    React.useEffect(() => {
        const candidateNames = allRoutesInfo
            .filter(route => {
                const regexPattern = route.pathRegex ? route.pathRegex : new RegExp(`^${route.path}$`);
                return regexPattern.test(location.pathname);
            })
            .map(route => route.name);
        setPageTitle(candidateNames.length === 0 || candidateNames.length > 1 ? "" : candidateNames[0]);
    }, [location])

    const {data: notifications} = useQuery(["notificationsCount"],
        () => NotificationService.numberOfNotifications(false), {
            refetchInterval: 5000,
            keepPreviousData: true
        });

    return (
        <>
            <Typography variant="h6" noWrap className={classes.title}>{pageTitle}</Typography>
            <IconButton
                color="inherit"
                onClick={() => browserHistory.push(NOTIFICATION_VIEW_PATH)}
            >
                <Badge badgeContent={notifications ?? 0} color="secondary">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>
            <PopperIconButton icon={<PersonIcon/>}>
                {
                    ({menuListProps, popperClose}) => <MenuList {...menuListProps}>
                        <MenuItem
                            component={Link}
                            to={PROFILE_VIEW_PATH}
                            className={classes.dropdownItem}
                            onClick={popperClose}
                        >
                            حساب کاربری
                        </MenuItem>
                        <Divider/>
                        <MenuItem
                            onClick={() => AuthenticationService.logout()}
                            className={classes.dropdownItem}
                        >
                            خروج
                        </MenuItem>
                    </MenuList>
                }
            </PopperIconButton>
        </>
    );
}

export default MainViewAppBar;