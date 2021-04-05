import {Badge, ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import {AxiosResponse} from "axios";
import classNames from 'classnames';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {Switch, useLocation, useRouteMatch} from "react-router-dom";
import ListItemLink from '../components/List/ListItemLink';
import {PrivateRoute} from "../components/Route/CustomRoute";
import apiAxios from "../config/axios-config";
import AuthenticationService from "../services/api/AuthenticationService";
import {API_USER_PATH} from "../services/ApiPaths";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        },
        title: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: 18,
        },
        menuButtonHidden: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerOpen: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            width: drawerWidth,
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        },
        dropdownItem: {
            display: "block",
            whiteSpace: "nowrap",
            textAlign: "right",
        },
        icons: {
            color: "white"
        }
    }),
);

interface User {
    username: string
}

interface UserApiResponse {
    users: Array<User>
}

const DashboardView: React.FunctionComponent = () => {
    const classes = useStyles();
    const match = useRouteMatch();
    const location = useLocation();

    const [open, setOpen] = React.useState<boolean>(false);
    const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        apiAxios.get<UserApiResponse, AxiosResponse<UserApiResponse>>(API_USER_PATH)
            .then(value => setUsers(value.data.users))
            .catch(err => console.log("error"));
    }, [location.key])

    const openProfileId = Boolean(profileAnchorEl) ? 'transitions-popper' : undefined;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleCloseProfile = () => {
        setProfileAnchorEl(null);
    };

    const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
        setProfileAnchorEl(profileAnchorEl ? null : event.currentTarget);
    };

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {[classes.appBarShift]: open})}
            >
                <Toolbar dir="rtl">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        داشبورد
                    </Typography>
                    <IconButton className={classes.icons}>
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <div>
                        <IconButton
                            aria-owns={openProfileId}
                            aria-haspopup="true"
                            onClick={handleClickProfile}
                        >
                            <PersonIcon className={classes.icons}/>
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
                </Toolbar>
            </AppBar>
            <main dir="rtl" className={classes.content}>
                <div className={classes.toolbar}/>
                <Typography paragraph>
                    بخش مشترک
                </Typography>
                <Switch>
                    <PrivateRoute exact path={match.path}>
                        <div>
                            <Typography paragraph>
                                نام کاربران که به صورت امتحانی صرفا دریافت شده و نمایش داده شده است:
                            </Typography>
                            <List>
                                {
                                    users.map(u => <ListItem dir="rtl" key={u.username}>
                                        <ListItemText primary={u.username}/>
                                    </ListItem>)
                                }
                            </List>
                        </div>
                    </PrivateRoute>
                    <PrivateRoute path={`${match.path}/setting`}>
                        <Typography paragraph>
                            صفحه تنظیمات
                        </Typography>
                    </PrivateRoute>
                </Switch>
            </main>
            <Drawer
                variant="permanent"
                anchor="right"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronRightIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItemLink key='home' dir="rtl" to={match.path} primary="صفحه اصلی" icon={<HomeIcon/>}/>
                    <ListItemLink key='setting' dir="rtl" to={`${match.path}/setting`} primary="تنظیمات"
                                  icon={<SettingsIcon/>}/>
                </List>
                <Divider/>
                <List>
                    <ListItem dir="rtl" button key='Inbox'>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText primary="پیام‌ها"/>
                    </ListItem>
                    <ListItem dir="rtl" button key='email'>
                        <ListItemIcon><MailIcon/></ListItemIcon>
                        <ListItemText primary="ایمیل‌ها"/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default DashboardView;