import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import React from 'react';
import NavBar, {NAV_BAR_WIDTH} from "../components/NavBar/NavBar";
import DashboardAppBar from "./dashboard/DashboardAppBar";
import DashboardContentRoutes from "./dashboard/DashboardContentRoutes";
import DashboardNavBarLinks from "./dashboard/DashboardNavBarLinks";

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
            width: `calc(100% - ${NAV_BAR_WIDTH}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: NAV_BAR_WIDTH,
        },
        menuButton: {
            marginLeft: 18,
        },
        menuButtonHidden: {
            display: 'none',
        },
        offset: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    }),
);

const DashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(false);
    const navBarOnOpenHandler = () => {
        setOpen(true);
    };
    const navBarOnCloseHandler = () => {
        setOpen(false);
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
                        onClick={navBarOnOpenHandler}
                        className={classNames(classes.menuButton, {[classes.menuButtonHidden]: open})}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <DashboardAppBar/>
                </Toolbar>
            </AppBar>
            <main dir="rtl" className={classes.content}>
                <div className={classes.offset}/>
                <DashboardContentRoutes/>
            </main>
            <NavBar open={open} onClose={navBarOnCloseHandler}>
                <DashboardNavBarLinks/>
            </NavBar>
        </div>
    );
}

export default DashboardView;