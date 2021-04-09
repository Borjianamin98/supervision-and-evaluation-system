import {Badge, ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import AuthenticationService from "../../services/api/AuthenticationService";

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

    const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
    const openProfileId = Boolean(profileAnchorEl) ? 'transitions-popper' : undefined;
    const handleCloseProfile = () => {
        setProfileAnchorEl(null);
    };
    const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(profileAnchorEl ? null : event.currentTarget);
    };

    return (
        <>
            <Typography variant="h6" noWrap className={classes.title}>
                داشبورد
            </Typography>
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