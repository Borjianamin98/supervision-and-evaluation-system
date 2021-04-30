import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import NavBar from "../../components/NavBar/NavBar";
import MainViewAppBar from "./MainViewAppBar";
import MainViewContent from "./MainViewContent";
import DashboardNavBarLinks from "./MainViewNavBarLinks";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            overflowX: "hidden",
        },
        offset: theme.mixins.toolbar
    }),
);

const MainView: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.offset}/>
                <MainViewContent/>
            </main>
            <NavBar appBarContent={<MainViewAppBar/>}>
                <DashboardNavBarLinks/>
            </NavBar>
        </div>
    );
}

export default MainView;