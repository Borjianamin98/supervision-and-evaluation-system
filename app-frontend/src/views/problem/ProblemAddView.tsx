import {Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import React from 'react';
import SwipeableViews from "react-swipeable-views";

const useStyles = makeStyles((theme) => ({
    root: {},
    tabPanel: {
        direction: "rtl",
        padding: theme.spacing(3, 0)
    },
    paper: {
        margin: theme.spacing(0, 1),
        padding: theme.spacing(3),
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        height: "100%"
    },
}));

interface TabPanelProps {
    index: number;
    value: number;
}

const TabPanel: React.FunctionComponent<TabPanelProps> = (props) => {
    const classes = useStyles();
    const {value, index, ...rest} = props;

    return (
        <div
            hidden={value !== index}
            className={classes.tabPanel}
            {...rest}
        >
            {props.children}
        </div>
    );
}

const ProblemAddView: React.FunctionComponent = () => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setTabIndex(index);
    };

    return (
        <div className={classes.root} dir="rtl">
            <AppBar position="static">
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    aria-label="tabs"
                    indicatorColor="secondary"
                >
                    <Tab label="اطلاعات کلی"/>
                    <Tab label="اطلاعات تکمیلی"/>
                    <Tab label="بازبینی"/>
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis="x-reverse"
                index={tabIndex}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={tabIndex} index={0}>
                    اطلاعات کلی
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    اطلاعات تکمیلی
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    بازبینی
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default ProblemAddView;