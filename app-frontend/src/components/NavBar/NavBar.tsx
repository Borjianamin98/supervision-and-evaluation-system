import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import classNames from 'classnames';
import React from 'react';

const NAV_BAR_WIDTH = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        offset: theme.mixins.toolbar
    }),
);

interface NavBarProps {
    open: boolean,
    onClose: () => void,
}

const NavBar: React.FunctionComponent<NavBarProps> = (props) => {
    const classes = useStyles();

    return (
        <Drawer
            variant="permanent"
            anchor="right"
            className={classNames(classes.drawer, {
                [classes.drawerOpen]: props.open,
                [classes.drawerClose]: !props.open,
            })}
            classes={{
                paper: classNames({
                    [classes.drawerOpen]: props.open,
                    [classes.drawerClose]: !props.open,
                }),
            }}
        >
            <div className={classes.offset}>
                <IconButton onClick={props.onClose}>
                    <ChevronRightIcon/>
                </IconButton>
            </div>
            <Divider/>
            {props.children}
        </Drawer>
    );
}

export {NAV_BAR_WIDTH};
export default NavBar;