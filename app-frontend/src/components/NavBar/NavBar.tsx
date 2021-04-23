import AppBar from "@material-ui/core/AppBar";
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from "@material-ui/core/Hidden";
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
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
        drawerTemporary: {
            width: NAV_BAR_WIDTH,
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
    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const container = window !== undefined ? () => document.body : undefined;

    const [open, setOpen] = React.useState<boolean>(false);
    const navBarToggleHandler = () => {
        setOpen(prevState => !prevState);
    };

    return (
        <div>
            <AppBar
                position="fixed"
                className={classNames({
                        [classes.appBar]: true,
                        [classes.appBarShift]: !mobileMatches && open
                    }
                )}
            >
                <Toolbar dir="rtl">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={navBarToggleHandler}
                        className={classNames({
                                [classes.menuButton]: !mobileMatches,
                                [classes.menuButtonHidden]: !mobileMatches && open
                            }
                        )}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {props.appBarContent}
                </Toolbar>
            </AppBar>
            <Drawer
                container={mobileMatches ? container : undefined}
                variant={mobileMatches ? "temporary" : "permanent"}
                anchor="right"
                open={mobileMatches ? open : undefined}
                onClose={() => mobileMatches ? navBarToggleHandler() : undefined}
                ModalProps={{
                    keepMounted: mobileMatches, // Better open performance on mobile.
                }}
                className={classNames({
                    [classes.drawer]: !mobileMatches,
                    [classes.drawerOpen]: !mobileMatches && open,
                    [classes.drawerClose]: !mobileMatches && !open,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerTemporary]: mobileMatches,
                        [classes.drawerOpen]: !mobileMatches && open,
                        [classes.drawerClose]: !mobileMatches && !open,
                    })
                }}
            >
                <Hidden xsDown implementation="css">
                    <div className={classes.offset}>
                        <IconButton onClick={navBarToggleHandler}>
                            <ChevronRightIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                </Hidden>
                {props.children}
            </Drawer>
        </div>
    );
}

export default NavBar;