import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import NavBar from "../components/NavBar/NavBar";
import DashboardAppBar from "./dashboard/DashboardAppBar";
import DashboardContentRoutes from "./dashboard/DashboardContentRoutes";
import DashboardNavBarLinks from "./dashboard/DashboardNavBarLinks";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        },
        offset: theme.mixins.toolbar
    }),
);

const DashboardView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <main dir="rtl" className={classes.content}>
                <div className={classes.offset}/>
                <DashboardContentRoutes/>
            </main>
            <NavBar appBarContent={<DashboardAppBar/>}>
                <DashboardNavBarLinks/>
            </NavBar>
        </div>
    );
}

export default DashboardView;