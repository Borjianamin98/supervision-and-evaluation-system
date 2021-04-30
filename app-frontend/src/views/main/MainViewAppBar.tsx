import {Badge, ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import {useLocation} from "react-router-dom";
import AuthenticationService from "../../services/api/AuthenticationService";
import {allRoutesInfo} from "./MainViewNavBarLinks";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        dropdownItem: {
            display: "block",
            whiteSpace: "nowrap",
            textAlign: "right",
        }
    }),
);

const MainViewAppBar: React.FunctionComponent = () => {
    const classes = useStyles();
    const [pageTitle, setPageTitle] = React.useState("");

    const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
    const openProfileId = Boolean(profileAnchorEl) ? 'transitions-popper' : undefined;
    const handleCloseProfile = () => {
        setProfileAnchorEl(null);
    };
    const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(profileAnchorEl ? null : event.currentTarget);
    };

    const location = useLocation();
    React.useEffect(() => {
        const candidateNames = allRoutesInfo
            .filter(route => location.pathname.includes(route.path))
            .map(route => route.name);
        setPageTitle(candidateNames.length === 0 || candidateNames.length > 1 ? "" : candidateNames[0]);
    }, [location])

    return (
        <>
            <Typography variant="h6" noWrap className={classes.title}>{pageTitle}</Typography>
            <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>
            <div>
                <IconButton
                    color="inherit"
                    aria-owns={openProfileId}
                    aria-haspopup="true"
                    onClick={handleClickProfile}
                >
                    <PersonIcon/>
                </IconButton>
                <Popper id={openProfileId}
                        open={Boolean(profileAnchorEl)}
                        anchorEl={profileAnchorEl}
                        transition
                        disablePortal
                >
                    {({TransitionProps}) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseProfile}>
                                    <MenuList dir="rtl">
                                        <MenuItem
                                            className={classes.dropdownItem}
                                        >
                                            حساب کاربری
                                        </MenuItem>
                                        <MenuItem
                                            onClick={handleCloseProfile}
                                            className={classes.dropdownItem}
                                        >
                                            تنظیمات
                                        </MenuItem>
                                        <Divider/>
                                        <MenuItem
                                            onClick={() => AuthenticationService.logout()}
                                            className={classes.dropdownItem}
                                        >
                                            خروج
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        </>
    );
}

export default MainViewAppBar;