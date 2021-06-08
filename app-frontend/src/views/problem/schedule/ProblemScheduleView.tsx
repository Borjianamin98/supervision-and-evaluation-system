import blue from '@material-ui/core/colors/blue';
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import purple from '@material-ui/core/colors/purple';
import teal from '@material-ui/core/colors/teal';
import {Theme, ThemeProvider} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import CustomScheduler from "../../../components/Scheduler/CustomScheduler";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {DateRange} from "../../../model/schedule/DateRange";
import {ScheduleEvent, SyncfusionSchedulerEvent} from "../../../model/schedule/ScheduleEvent";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ScheduleService from "../../../services/api/schedule/ScheduleService";
import DateUtils from "../../../utility/DateUtils";

function scheduleEventToSyncfusionSchedulerEvent(event: ScheduleEvent, userId: number): SyncfusionSchedulerEvent {
    return {
        id: event.id,
        subject: event.owner.fullName,
        startDate: event.startDate,
        endDate: event.endDate,
        isAllDay: false,
        ownerId: event.owner.id,
        readonly: event.owner.id !== userId,
    }
}

interface ProblemScheduleViewProps {
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem} = props;

    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const smallScreenMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const totalDaysInView = mobileMatches ? 3 : (smallScreenMatches ? 5 : 7);


    const [startDate, setStartDate] = React.useState(DateUtils.getCurrentDate());
    const queryClient = useQueryClient();
    const {data: problemScheduleEvents, ...problemScheduleEventsQuery} = useQuery(
        ["meetScheduleEvents", problem.meetSchedule.id, startDate, totalDaysInView],
        () => {
            const jwtPayloadUserId = AuthenticationService.getJwtPayloadUserId()!;
            const endDate = DateUtils.addDays(startDate, totalDaysInView);
            return ScheduleService.retrieveMeetScheduleEvents(problem.meetSchedule.id, startDate, endDate)
                .then(events => events.map(event => scheduleEventToSyncfusionSchedulerEvent(event, jwtPayloadUserId)))
        }
    );

    const onDateChange = (startDate: Date) => {
        setStartDate(startDate);
    }

    const onCellClick = (scheduler: ScheduleComponent, scheduleEventDate: DateRange) => {
        const jwtPayloadUserId = AuthenticationService.getJwtPayloadUserId()!;
        ScheduleService.addMeetScheduleEvent(problem.meetSchedule.id, {
            startDate: scheduleEventDate.startDate,
            endDate: scheduleEventDate.endDate,
        })
            .then(data => scheduler.addEvent(scheduleEventToSyncfusionSchedulerEvent(data, jwtPayloadUserId)))
            .catch((error: AxiosError) => {
                generalErrorHandler(error, enqueueSnackbar);
            })
    }

    const onEventChange = (scheduler: ScheduleComponent, syncfusionEvent: SyncfusionSchedulerEvent) => {
        ScheduleService.updateMeetScheduleEvent(problem.meetSchedule.id, syncfusionEvent.id, {
            startDate: syncfusionEvent.startDate,
            endDate: syncfusionEvent.endDate,
        }).catch(error => generalErrorHandler(error, enqueueSnackbar))
    }

    const onEventDelete = (scheduler: ScheduleComponent, syncfusionEvent: SyncfusionSchedulerEvent) => {
        ScheduleService.deleteMeetScheduleEvent(problem.meetSchedule.id, syncfusionEvent.id)
            .then(() => scheduler.deleteEvent(syncfusionEvent))
            .catch(error => generalErrorHandler(error, enqueueSnackbar))
    }

    const candidateColors = [blue[500], purple[500], teal[500], indigo[500]]
    const participants = [
        {
            id: problem.student.id,
            name: problem.student.fullName,
            color: deepOrange[500],
        },
        {
            id: problem.supervisor.id,
            name: problem.supervisor.fullName,
            color: brown[500],
        },
        ...problem.referees.map((referee, i) => {
            return {
                id: referee.id,
                name: referee.fullName,
                color: candidateColors[i],
            }
        }),
    ]

    return (
        <ThemeProvider theme={rtlTheme}>
            <CustomScheduler
                totalDaysInView={totalDaysInView}
                selectedDate={startDate}
                onDateChange={onDateChange}
                scheduleEvents={problemScheduleEvents}
                participants={participants}
                onCellClick={onCellClick}
                onEventDelete={onEventDelete}
                onEventChange={onEventChange}
            />
        </ThemeProvider>
    )
}

export default ProblemScheduleView;