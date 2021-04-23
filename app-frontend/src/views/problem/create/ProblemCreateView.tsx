import {Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import {ClassNameMap} from "notistack";
import React from 'react';
import SwipeableViews from "react-swipeable-views";
import {Problem} from "../../../model/problem";
import ProblemService from "../../../services/api/ProblemService";
import ExtraInfo from "./ExtraInfo";
import GeneralInfo from "./GeneralInfo";
import ReviewTab from "./ReviewTab";
import TabPanel from "./TabPanel";

const useCommonStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
        height: `calc(100% - ${theme.spacing(1) * 2}px)`, // Based on margin
    },
    title: {
        margin: theme.spacing(1, 0, 0, 0),
    },
    justifyAlign: {
        textAlign: "justify",
    }
}));

export interface ProblemTabProps {
    commonClasses: ClassNameMap<"title" | "paper" | "justifyAlign">,
    problem: Problem,
    setProblem: React.Dispatch<React.SetStateAction<Problem>>,
    errorChecking: boolean,
    setErrorChecking: React.Dispatch<React.SetStateAction<boolean>>,
}

const ProblemCreateView: React.FunctionComponent = () => {
    const commonClasses = useCommonStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [errorChecking, setErrorChecking] = React.useState(false);

    const handleChangeIndex = (index: number) => {
        setTabIndex(index);
    };

    const [problem, setProblem] = React.useState<Problem>(ProblemService.createInitialProblem());
    const commonTabProperties = {
        commonClasses: commonClasses,
        problem: problem,
        setProblem: setProblem,
        errorChecking: errorChecking,
        setErrorChecking: setErrorChecking,
    }

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
                    <GeneralInfo {...commonTabProperties}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <ExtraInfo {...commonTabProperties}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <ReviewTab {...commonTabProperties}/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default ProblemCreateView;