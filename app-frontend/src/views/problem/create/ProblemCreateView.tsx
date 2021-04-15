import {Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import SwipeableViews from "react-swipeable-views";
import GeneralInfo from "./GeneralInfo";
import TabPanel from "./TabPanel";

const ProblemCreateView: React.FunctionComponent = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChangeIndex = (index: number) => {
        setTabIndex(index);
    };

    return (
        <div>
            <AppBar position="static">
                <Tabs
                    dir="rtl"
                    value={tabIndex}
                    onChange={(event, value) => handleChangeIndex(value)}
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
                    <GeneralInfo/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Typography dir="rtl">اطلاعات تکمیلی</Typography>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography dir="rtl">بازبینی</Typography>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default ProblemCreateView;