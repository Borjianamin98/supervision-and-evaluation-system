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
import ScheduleService from "../../../services/api/schedule/ScheduleService";
import ProblemScheduleCreate from "./ProblemScheduleCreate";
import ProblemScheduleModify from "./ProblemScheduleModify";

export type SaveMeetScheduleMutation = UseMutationResult<MeetSchedule, AxiosError<any>,
    { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }, unknown>;

interface ProblemScheduleViewProps {
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem} = props;

    const queryClient = useQueryClient();
    const saveMeetScheduleMutation: SaveMeetScheduleMutation = useMutation(
        (data: { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }) =>
            ScheduleService.saveMeetSchedule(data.meetScheduleId, data.meetScheduleSave),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    switch (problem.meetSchedule.scheduleState) {
        case ScheduleState.CREATED:
            return <ProblemScheduleCreate
                problem={problem}
                saveMeetScheduleMutation={saveMeetScheduleMutation}
            />
        case ScheduleState.STARTED:
            return <ProblemScheduleModify
                problem={problem}
                saveMeetScheduleMutation={saveMeetScheduleMutation}
            />
        default:
            return <HomeRedirect message={"دسترسی به صفحه‌ی مربوطه با توجه به وضعیت مسئله امکان‌پذیر نمی‌باشد."}/>
    }
}

export default ProblemScheduleView;