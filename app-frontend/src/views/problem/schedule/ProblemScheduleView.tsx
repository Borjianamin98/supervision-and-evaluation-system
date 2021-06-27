import {makeStyles} from "@material-ui/core/styles";
import React from 'react';
import HomeRedirect from "../../../components/Route/HomeRedirect";
import {Problem} from "../../../model/problem/problem";
import {MeetScheduleState} from '../../../model/schedule/MeetScheduleState';
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemScheduleCreate from "./ProblemScheduleCreate";
import ProblemScheduleModify from "./ProblemScheduleModify";

const useCommonStyles = makeStyles((theme) => ({
    topGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
    hidden: {
        display: "none",
    }
}));

interface ProblemScheduleViewProps {
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const commonClasses = useCommonStyles();
    const {problem} = props;

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;

    if (problem.referees.length !== problem.numberOfReferees) {
        return <HomeRedirect
            message={"دسترسی به صفحه‌ی مربوطه با توجه به عدم مشخص‌شدن تمامی داورهای مسئله امکان‌پذیر نمی‌باشد."}/>
    }

    switch (problem.meetSchedule.state) {
        case MeetScheduleState.CREATED:
            return currentUserIsSupervisor ?
                <ProblemScheduleCreate commonClasses={commonClasses} problem={problem}/> :
                <HomeRedirect message={"دسترسی به صفحه‌ی مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد."}/>
        case MeetScheduleState.STARTED:
            return <ProblemScheduleModify
                commonClasses={commonClasses}
                problem={problem}
            />
        default:
            return <HomeRedirect message={"دسترسی به صفحه‌ی مربوطه با توجه به وضعیت مسئله امکان‌پذیر نمی‌باشد."}/>
    }
}

export default ProblemScheduleView;