import {Box, BoxProps, Grow, IconButton} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme, ThemeProvider, useTheme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
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
import {generalErrorHandler} from "../config/axios-config";
import {ScheduleEventInfo, SyncfusionSchedulerEvent} from "../model/schedule/ScheduleEvent";
import ScheduleService from "../services/api/schedule/ScheduleService";
import "./scheduler.css"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
        },
        appointment: {
            textAlign: "center",
            overflow: "hidden",
        },
        centerAlign: {
            textAlign: "center"
        },
        imageIcon: {
            display: "flex",
            justifyContent: "center"
        },
    }),
);

var id = 2;
const SettingsView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();
    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isRtlTheme = theme.direction === 'rtl';

    const scheduleComponentRef = React.useRef<ScheduleComponent>(null);
    const totalDaysInView = mobileMatches ? 3 : 7;

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
    const hasBeyondMaxRange = () => {
        if (scheduleComponentRef.current) {
            const targetDate = moment(selectedDate).add(totalDaysInView, "days").toDate();
            return targetDate > scheduleComponentRef.current.maxDate;
        } else {
            return false;
        }
    }
    const hasBeforeMinRange = () => {
        if (scheduleComponentRef.current) {
            const targetDate = moment(selectedDate).add(-1, "days").toDate();
            return targetDate < scheduleComponentRef.current.minDate;
        } else {
            return false;
        }
    }
    const changeIntervalOnClick = (days: number) => {
        const targetDate = moment(selectedDate).add(days, "days").toDate();
        setSelectedDate(prevState => {
            scheduleComponentRef.current?.changeDate(targetDate);
            return targetDate;
        });
    }
    const headerBarDate = () => {
        const currentStartDateMoment = moment(selectedDate).locale("fa");
        const currentEndDateMoment = moment(selectedDate).add(totalDaysInView - 1, "days").locale("fa");
        const currentStartDateMonth = currentStartDateMoment.format("MMMM");
        const currentEndDateMonth = currentEndDateMoment.format("MMMM");
        if (currentStartDateMonth === currentEndDateMonth) {
            return currentStartDateMoment.format("D")
                + " تا "
                + currentEndDateMoment.format("D")
                + " "
                + currentStartDateMonth
                + " "
                + currentStartDateMoment.format("YYYY");
        } else {
            return currentStartDateMoment.format("D")
                + " "
                + currentStartDateMonth
                + " تا "
                + currentEndDateMoment.format("D")
                + " "
                + currentEndDateMonth
                + " "
                + currentStartDateMoment.format("YYYY");
        }
    }

    const onCellClick: EmitType<CellClickEventArgs> = (args) => {
        if (args) {
            if (args.isAllDay) {
                args.cancel = true; // Disable all day events.
            } else {
                if (scheduleComponentRef.current) {
                    addScheduleEvent.mutate([meetScheduleId, {
                        startDate: args.startTime,
                        endDate: args.endTime,
                    }])
                    // const Data: SyncfusionSchedulerEvent[] = [{
                    //     id: id++,
                    //     subject: "جدید",
                    //
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

    const EventTemplate = (props: SyncfusionSchedulerEvent) => {
        const [isBackdrop, setIsBackdrop] = React.useState(false);

        const appointmentClick: BoxProps["onClick"] = (event) => {
            event.stopPropagation(); // Suppress scheduler events
            setIsBackdrop(prevState => !prevState);
        }
        return (
            <Box dir="rtl" padding={1} style={{height: "100%"}} onClick={appointmentClick}>
                <Typography variant="body2" className={classes.appointment}>
                    {props.subject}
                </Typography>
                <Grow in={isBackdrop}>
                    <CenterBox className={classes.backdrop}>
                        <IconButton aria-label="delete" color="inherit">
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </CenterBox>
                </Grow>
            </Box>
        )
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
        // if (actionEventArgs) {
        //     console.log("onActionBegin: " + actionEventArgs.requestType);
        //     if (actionEventArgs.requestType === "eventCreate") {
        //         const newEvent = actionEventArgs.addedRecords
        //             && actionEventArgs.addedRecords[0] as SyncfusionSchedulerEvent;
        //         if (newEvent) {
        //             console.log(newEvent);
        //         }
        //     }
        // }
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

    return (
        <ThemeProvider theme={rtlTheme}>
            <Box paddingY={1} className="e-schedule e-schedule-toolbar">
                <Grid
                    container alignItems="center" justify="space-between"
                    wrap="nowrap"
                    dir="rtl"
                >
                    <Grid item>
                        <IconButton
                            color="primary"
                            onClick={() => isRtlTheme ? changeIntervalOnClick(totalDaysInView) : changeIntervalOnClick(-totalDaysInView)}
                            disabled={isRtlTheme ? hasBeyondMaxRange() : hasBeforeMinRange()}
                        >
                            {isRtlTheme ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography color="textPrimary" variant="body1" style={{textAlign: "center"}}>
                            {headerBarDate()}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            color="primary"
                            onClick={() => isRtlTheme ? changeIntervalOnClick(-totalDaysInView) : changeIntervalOnClick(+totalDaysInView)}
                            disabled={isRtlTheme ? hasBeforeMinRange() : hasBeyondMaxRange()}
                        >
                            {isRtlTheme ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
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
                        eventTemplate={(props: SyncfusionSchedulerEvent) => EventTemplate(props)}
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