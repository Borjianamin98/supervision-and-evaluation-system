import {Theme, ThemeProvider, useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../App";
import CustomScheduler from "../components/Scheduler/CustomScheduler";
import "../components/Scheduler/scheduler.css"
import {generalErrorHandler} from "../config/axios-config";
import {DateRange} from "../model/schedule/DateRange";
import {ScheduleEventInfo, SyncfusionSchedulerEvent} from "../model/schedule/ScheduleEvent";
import AuthenticationService from "../services/api/AuthenticationService";
import ScheduleService from "../services/api/schedule/ScheduleService";
import DateUtils from "../utility/DateUtils";

const SettingsView: React.FunctionComponent = () => {
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const smallScreenMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const totalDaysInView = mobileMatches ? 3 : (smallScreenMatches ? 5 : 7);

    const meetScheduleId = 1;
    const jwtPayloadUserId = AuthenticationService.getJwtPayloadUserId();

    const [startDate, setStartDate] = React.useState(DateUtils.getCurrentDate());
    const endDate = DateUtils.addDays(startDate, totalDaysInView);
    const queryClient = useQueryClient();
    const {data: scheduleEventsInfo, ...scheduleEventsInfoQuery} = useQuery(
        ["meetSchedule", meetScheduleId, 'events', startDate, endDate],
        () => ScheduleService.retrieveMeetScheduleEvents(meetScheduleId, startDate, endDate), {
            keepPreviousData: true,
        });

    const scheduleEventToSyncfusionSchedulerEvent = (event: ScheduleEventInfo): SyncfusionSchedulerEvent => {
        return {
            id: event.id,
            subject: event.owner.fullName!,
            startDate: event.startDate,
            endDate: event.endDate,
            isAllDay: false,
            ownerId: event.owner.id!,
            readonly: event.owner.id! !== jwtPayloadUserId!,
        }
    }

    const onDateChange = (startDate: Date) => {
        setStartDate(startDate);
    }

    const onCellClick = (scheduler: ScheduleComponent, scheduleEventDate: DateRange) => {
        ScheduleService.addMeetScheduleEvent(meetScheduleId, {
            startDate: scheduleEventDate.startDate,
            endDate: scheduleEventDate.endDate,
        })
            .then(data => scheduler.addEvent(scheduleEventToSyncfusionSchedulerEvent(data)))
            .catch((error: AxiosError) => {
                generalErrorHandler(error, enqueueSnackbar);
            })
    }

    const onEventChange = (scheduler: ScheduleComponent, syncfusionEvent: SyncfusionSchedulerEvent) => {
        ScheduleService.updateMeetScheduleEvent(meetScheduleId, syncfusionEvent.id, {
            startDate: syncfusionEvent.startDate,
            endDate: syncfusionEvent.endDate,
        }).catch(error => generalErrorHandler(error, enqueueSnackbar))
    }

    const onEventDelete = (scheduler: ScheduleComponent, syncfusionEvent: SyncfusionSchedulerEvent) => {
        ScheduleService.deleteMeetScheduleEvent(meetScheduleId, syncfusionEvent.id)
            .then(() => scheduler.deleteEvent(syncfusionEvent))
            .catch(error => generalErrorHandler(error, enqueueSnackbar))
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <CustomScheduler
                totalDaysInView={totalDaysInView}
                selectedDate={startDate}
                onDateChange={onDateChange}
                // scheduleEvents={}
                participants={[
                    {id: 1, name: 'Nancy', color: theme.palette.primary.main},
                    {id: 2, name: 'Steven', color: theme.palette.secondary.main},
                    {id: 3, name: 'Michael', color: '#7499e1'}
                ]}
                onCellClick={onCellClick}
                onEventDelete={onEventDelete}
                onEventChange={onEventChange}
                eventSettings={{
                    dataSource: scheduleEventsInfo?.map(scheduleEventToSyncfusionSchedulerEvent),
                    fields: {
                        id: 'id',
                        subject: {name: 'subject'},
                        isAllDay: {name: 'isAllDay'},
                        startTime: {name: 'startDate'},
                        endTime: {name: 'endDate'},
                        isReadonly: 'readonly'
                    }
                }}
            />
        </ThemeProvider>
    )
}

export default SettingsView;