import { makeStyles } from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, UseMutationResult, useQueryClient} from "react-query";
import HomeRedirect from "../../../components/Route/HomeRedirect";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {MeetSchedule} from "../../../model/schedule/MeetSchedule";
import {MeetScheduleSave} from '../../../model/schedule/MeetScheduleSave';
import {ScheduleState} from '../../../model/schedule/ScheduleState';
import AuthenticationService from "../../../services/api/AuthenticationService";
import ScheduleService from "../../../services/api/schedule/ScheduleService";
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
}));

export type SaveMeetScheduleMutation = UseMutationResult<MeetSchedule, AxiosError<any>,
    { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }, unknown>;

interface ProblemScheduleViewProps {
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const commonClasses = useCommonStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {problem} = props;

    const queryClient = useQueryClient();
    const saveMeetScheduleMutation: SaveMeetScheduleMutation = useMutation(
        (data: { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }) =>
            ScheduleService.startMeetSchedule(data.meetScheduleId, data.meetScheduleSave),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;

    switch (problem.meetSchedule.scheduleState) {
        case ScheduleState.CREATED:
            return currentUserIsSupervisor ?
                <ProblemScheduleCreate commonClasses={commonClasses} problem={problem}/> :
                <HomeRedirect message={"دسترسی به صفحه‌ی مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد."}/>
        case ScheduleState.STARTED:
            return <ProblemScheduleModify
                commonClasses={commonClasses}
                problem={problem}
                saveMeetScheduleMutation={saveMeetScheduleMutation}
            />
        default:
            return <HomeRedirect message={"دسترسی به صفحه‌ی مربوطه با توجه به وضعیت مسئله امکان‌پذیر نمی‌باشد."}/>
    }
}

export default ProblemScheduleView;