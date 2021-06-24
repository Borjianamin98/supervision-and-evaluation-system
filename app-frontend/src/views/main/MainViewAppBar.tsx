import {Badge, MenuItem, MenuList} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import {Link, useLocation} from "react-router-dom";
import PopperIconButton from "../../components/Popper/PopperIconButton";
import AuthenticationService from "../../services/api/AuthenticationService";
import {PROFILE_VIEW_PATH} from "../ViewPaths";
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

    return (
        <>
            <Typography variant="h6" noWrap className={classes.title}>{pageTitle}</Typography>
            <PopperIconButton
                icon={
                    <Badge badgeContent={0} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                }>
                {
                    ({menuListProps, popperClose}) => <MenuList {...menuListProps}>
                        <MenuItem
                            className={classes.dropdownItem}
                            onClick={popperClose}
                        >
                            پیامی وجود ندارد.
                        </MenuItem>
                    </MenuList>
                }
            </PopperIconButton>
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