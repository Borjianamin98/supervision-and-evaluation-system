import React from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import classNames from 'classnames';
import {Badge, Button, ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Person} from '@material-ui/icons';

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
        listItemText: {
            textAlign: "right",
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

const Dashboard: React.FunctionComponent = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState<boolean>(false);
    const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);

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
                        <Button
                            aria-owns={openProfileId}
                            aria-haspopup="true"
                            onClick={handleClickProfile}
                        >
                            <Person className={classes.icons}/>
                        </Button>
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
                                                    onClick={handleCloseProfile}
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
                    بخش اول
                </Typography>
                <Typography paragraph>
                    بخش دوم
                </Typography>
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
                    <ListItem dir="rtl" button key='Inbox'>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText className={classes.listItemText} primary="پیام‌ها"/>
                    </ListItem>
                    <ListItem dir="rtl" button key='Inbox'>
                        <ListItemIcon><MailIcon/></ListItemIcon>
                        <ListItemText className={classes.listItemText} primary="ایمیل‌ها"/>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem dir="rtl" button key='Inbox'>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText className={classes.listItemText} primary="پیام‌ها"/>
                    </ListItem>
                    <ListItem dir="rtl" button key='Inbox'>
                        <ListItemIcon><MailIcon/></ListItemIcon>
                        <ListItemText className={classes.listItemText} primary="ایمیل‌ها"/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default Dashboard;