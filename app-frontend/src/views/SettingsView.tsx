import {Theme, ThemeProvider, useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {EmitType} from '@syncfusion/ej2-base'
import {
    ActionEventArgs,
    CellClickEventArgs,
    Day,
    DragAndDrop,
    Inject,
    PopupOpenEventArgs,
    Resize,
    ResourceDirective,
    ResourcesDirective,
    ScheduleComponent,
    TimelineViews,
    ViewDirective,
    ViewsDirective
} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import moment from "jalali-moment";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../App";
import CenterBox from "../components/Grid/CenterBox";
import AppointmentEventTemplate from "../components/Scheduler/AppointmentEventTemplate";
import ScheduleHeaderBar from "../components/Scheduler/ScheduleHeaderBar";
import {generalErrorHandler} from "../config/axios-config";
import {ScheduleEventInfo, SyncfusionSchedulerEvent} from "../model/schedule/ScheduleEvent";
import ScheduleService from "../services/api/schedule/ScheduleService";
import "./scheduler.css"

var id = 2;
const SettingsView: React.FunctionComponent = () => {
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();
    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const largeScreenMatches = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const scheduleComponentRef = React.useRef<ScheduleComponent>(null);
    const totalDaysInView = largeScreenMatches ? 7 : (mobileMatches ? 3 : 5);

    const onPopupOpen: EmitType<PopupOpenEventArgs> = (args) => {
        if (args) {
            args.cancel = true;
        }
    }

    const dateHeaderTemplate = (props: { date: Date }) => {
        const dateMoment = moment(props.date).locale('fa');
        return (
            <CenterBox>
                <div className="e-header-date">{dateMoment.format('D')}</div>
                <div className="e-header-day">
                    {dateMoment.format('ddd')}
                </div>
            </CenterBox>
        );
    }

    const majorSlotTemplate = (props: { date: Date }) => {
        return (
            <div>{moment(props.date).locale('fa').format("hh:mm a")}</div>
        );
    }
    if (scheduleComponentRef.current) {
        // Unfortunately, 'timescale' field doesn't support function as template and
        // because of typescript, we should use approach like this to override it.
        (scheduleComponentRef.current.timeScale as any).majorSlotTemplate = majorSlotTemplate;
    }

    const onDataBound = () => {
        if (scheduleComponentRef.current?.scheduleTouchModule) {
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj.destroy();
            // @ts-ignore
            scheduleComponentRef.current.scheduleTouchModule.touchObj = null;
        }
    }

    const [selectedDate, setSelectedDate] = React.useState(moment(new Date())
        .set({hour: 0, minute: 0, second: 0, millisecond: 0}).toDate());


    const onCellClick: EmitType<CellClickEventArgs> = (args) => {
        if (args) {
            if (args.isAllDay) {
                args.cancel = true; // Disable all day events.
            } else {
                if (scheduleComponentRef.current) {
                    // addScheduleEvent.mutate([meetScheduleId, {
                    //     startDate: args.startTime,
                    //     endDate: args.endTime,
                    // }])
                    ScheduleService.addMeetScheduleEvent(meetScheduleId, {
                        startDate: args.startTime,
                        endDate: args.endTime,
                    }).then(data => {
                        if (scheduleComponentRef.current) {
                            scheduleComponentRef.current.addEvent(scheduleEventToSyncfusionSchedulerEvent(data));
                        }
                    }).catch((error: AxiosError) => {
                        generalErrorHandler(error, enqueueSnackbar);
                    })
                    // const Data: SyncfusionSchedulerEvent[] = [{
                    //     id: id++,
                    //     subject: "جدید",
                    //     startDate: args.startTime,
                    //     endDate: args.endTime,
                    //     isAllDay: false,
                    //     ownerId: (id % 3) + 1,
                    // }];
                    // scheduleComponentRef.current.addEvent(Data);
                }
            }
        }
    }

    const OnCellDoubleClick: EmitType<CellClickEventArgs> = (args) => {
        if (args) {
            args.cancel = true;
        }
    }


    const meetScheduleId = 1;
    // const startDate = moment(selectedDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toDate();
    const endDate = moment(selectedDate).add(totalDaysInView - 1, "days").toDate();

    const queryClient = useQueryClient();
    const {data: scheduleEventsInfo, ...scheduleEventsInfoQuery} = useQuery(
        ["meetSchedule", meetScheduleId, 'scheduleEvents', selectedDate],
        () => ScheduleService.retrieveMeetScheduleEvents(meetScheduleId, selectedDate, endDate), {
            keepPreviousData: true,
            refetchOnWindowFocus: false, // For debugging
        });
    const addScheduleEvent = useMutation(
        (data: Parameters<typeof ScheduleService.addMeetScheduleEvent>) => ScheduleService.addMeetScheduleEvent(...data),
        {
            onSuccess: data => {
                // let newEvents;
                // if (scheduleEventsInfo) {
                //     newEvents = [...scheduleEventsInfo, data];
                // } else {
                //     newEvents = [data];
                // }
                // if (scheduleComponentRef.current) {
                //     scheduleComponentRef.current.addEvent(data);
                // }
                // queryClient.setQueryData(
                //     ["meetSchedule", meetScheduleId, 'scheduleEvents', startDate, endDate], newEvents);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const ownerData = [
        {id: 1, ownerName: 'Nancy', color: theme.palette.primary.main},
        {id: 2, ownerName: 'Steven', color: theme.palette.secondary.main},
        {id: 3, ownerName: 'Michael', color: '#7499e1'}
    ];

    const onActionBegin: EmitType<ActionEventArgs> = (actionEventArgs) => {
        if (actionEventArgs) {
            console.log("New Begin Event: " + actionEventArgs.requestType)
            if (actionEventArgs.requestType === "eventChange") {
                const changedEvent = actionEventArgs.changedRecords
                    && actionEventArgs.changedRecords[0] as SyncfusionSchedulerEvent;
                if (changedEvent && scheduleComponentRef.current) {
                    ScheduleService.updateMeetScheduleEvent(meetScheduleId, changedEvent.id, {
                        startDate: changedEvent.startDate,
                        endDate: changedEvent.endDate,
                    })
                        // .then(() => scheduleComponentRef.current?.saveEvent(changedEvent))
                        .catch(error => generalErrorHandler(error, enqueueSnackbar))
                    // actionEventArgs.cancel = true;
                }
            }
        }
    }

    const onActionComplete: EmitType<ActionEventArgs> = (actionEventArgs) => {
        // console.log("onActionComplete: " + actionEventArgs?.requestType)
    }

    const scheduleEventToSyncfusionSchedulerEvent = (event: ScheduleEventInfo): SyncfusionSchedulerEvent => {
        return {
            id: event.id,
            subject: event.owner.fullName!,
            startDate: event.startDate,
            endDate: event.endDate,
            isAllDay: false,
            ownerId: event.owner.id!
        }
    }

    const onDeleteSyncfusionEvent = (syncfusionEvent: SyncfusionSchedulerEvent) => {
        ScheduleService.deleteMeetScheduleEvent(meetScheduleId, syncfusionEvent.id)
            .then(() => scheduleComponentRef.current?.deleteEvent(syncfusionEvent))
            .catch(error => generalErrorHandler(error, enqueueSnackbar))
    }

    const minimumDate = new Date(new Date().getFullYear() - 1, 0, 1);
    const maximumDate = new Date(new Date().getFullYear() + 2, 0, 1);

    return (
        <ThemeProvider theme={rtlTheme}>
            <ScheduleHeaderBar
                totalDaysInView={totalDaysInView}
                startDate={selectedDate}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onDateChange={newDate => {
                    scheduleComponentRef.current?.changeDate(newDate);
                    setSelectedDate(newDate);
                }}
            />
            <ScheduleComponent
                // allowDragAndDrop={true}
                // allowResizing={true}
                ref={scheduleComponentRef}
                actionBegin={onActionBegin}
                actionComplete={onActionComplete}
                width="100%"
                cssClass="schedule-cell-dimension"
                showHeaderBar={false}
                allowInline={false}
                showQuickInfo={false}
                showTimeIndicator={false}
                allowMultiCellSelection={false}
                allowMultiDrag={false}
                allowMultiRowSelection={false}
                cellClick={onCellClick}
                cellDoubleClick={OnCellDoubleClick}
                dateHeaderTemplate={dateHeaderTemplate}
                dataBound={onDataBound}
                popupOpen={onPopupOpen}
                height="550px"
                enableRtl={true}
                selectedDate={selectedDate}
                minDate={minimumDate}
                maxDate={maximumDate}
                startHour="07:00"
                endHour="20:00"
                workHours={{
                    highlight: true, start: '09:00', end: '18:00'
                }}
                eventSettings={{
                    dataSource: scheduleEventsInfo?.map(scheduleEventToSyncfusionSchedulerEvent),
                    fields: {
                        id: 'id',
                        subject: {name: 'subject'},
                        isAllDay: {name: 'isAllDay'},
                        startTime: {name: 'startDate'},
                        endTime: {name: 'endDate'},
                        isReadonly: 'isReadonly'
                    }
                }}
            >
                <ViewsDirective>
                    <ViewDirective
                        option="Day"
                        interval={totalDaysInView}
                        workDays={[0, 1, 2, 3, 6]}
                        displayName="روزانه"
                        eventTemplate={(syncfusionEvent: SyncfusionSchedulerEvent) => AppointmentEventTemplate({
                            syncfusionEvent: syncfusionEvent,
                            onDelete: onDeleteSyncfusionEvent,
                        })}
                    />
                </ViewsDirective>
                <ResourcesDirective>
                    <ResourceDirective
                        field='ownerId'
                        title='فرد'
                        name='افراد'
                        dataSource={ownerData}
                        textField='ownerName'
                        idField='id'
                        colorField='color'
                    >
                    </ResourceDirective>
                </ResourcesDirective>
                <Inject services={[Day, TimelineViews, DragAndDrop, Resize]}/>
            </ScheduleComponent>
        </ThemeProvider>
    )
}

export default SettingsView;