import {Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {ClassNameMap} from "notistack";
import React from 'react';
import SwipeableViews from "react-swipeable-views";
import {Problem} from "../../../model/problem";
import ProblemService from "../../../services/api/ProblemService";
import ExtraInfo from "./ExtraInfo";
import GeneralInfo from "./GeneralInfo";
import TabPanel from "./TabPanel";

const useCommonStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    },
    title: {
        margin: theme.spacing(1, 0, 0, 0),
    }
}));

export interface ProblemTabProps {
    commonClasses: ClassNameMap<"title" | "paper">,
    problem: Problem,
    setProblem: React.Dispatch<React.SetStateAction<Problem>>,
}

const ProblemCreateView: React.FunctionComponent = () => {
    const commonClasses = useCommonStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChangeIndex = (index: number) => {
        setTabIndex(index);
    };

    const [problem, setProblem] = React.useState<Problem>(ProblemService.createInitialProblem());

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
                    <GeneralInfo commonClasses={commonClasses} problem={problem} setProblem={setProblem}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <ExtraInfo commonClasses={commonClasses} problem={problem} setProblem={setProblem}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Typography dir="rtl">بازبینی</Typography>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default ProblemCreateView;