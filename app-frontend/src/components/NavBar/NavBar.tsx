import AppBar from "@material-ui/core/AppBar";
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from "@material-ui/icons/Menu";
import classNames from 'classnames';
import React from 'react';

const NAV_BAR_WIDTH = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${NAV_BAR_WIDTH}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: NAV_BAR_WIDTH,
        },
        drawer: {
            width: NAV_BAR_WIDTH,
            flexShrink: 0,
        },
        drawerOpen: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            width: NAV_BAR_WIDTH,
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
        },
        menuButton: {
            marginLeft: 18,
        },
        menuButtonHidden: {
            display: 'none',
        },
        offset: theme.mixins.toolbar
    }),
);

interface NavBarProps {
    appBarContent: React.ReactElement
}

const NavBar: React.FunctionComponent<NavBarProps> = (props) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(false);
    const navBarOnOpenHandler = () => {
        setOpen(true);
    };
    const navBarOnCloseHandler = () => {
        setOpen(false);
    };

    return (
        <div>
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {[classes.appBarShift]: open})}
            >
                <Toolbar dir="rtl">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={navBarOnOpenHandler}
                        className={classNames(classes.menuButton, {[classes.menuButtonHidden]: open})}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {props.appBarContent}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                anchor="right"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.offset}>
                    <IconButton onClick={navBarOnCloseHandler}>
                        <ChevronRightIcon/>
                    </IconButton>
                </div>
                <Divider/>
                {props.children}
            </Drawer>
        </div>
    );
}

export default NavBar;