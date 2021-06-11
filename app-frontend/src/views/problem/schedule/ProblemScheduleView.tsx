import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import purple from '@material-ui/core/colors/purple';
import teal from '@material-ui/core/colors/teal';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {rtlTheme} from '../../../App';
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomDatePicker from "../../../components/DatePicker/CustomDatePicker";
import CustomScheduler from "../../../components/Scheduler/CustomScheduler";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {DateRange} from "../../../model/schedule/DateRange";
import {
    PERSIAN_SCHEDULE_DURATIONS,
    ScheduleDuration,
    scheduleDurationMapToEnglish,
    scheduleDurationMapToPersian
} from "../../../model/schedule/ScheduleDuration";
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

const useStyles = makeStyles((theme) => ({
    topGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

interface ProblemScheduleViewProps {
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const classes = useStyles();
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

    const [meetScheduleDuration, setMeetScheduleDuration] = React.useState(ScheduleDuration.THIRTY_MINUTES);
    const [meetScheduleMinDate, setMeetScheduleMinDate] = React.useState(DateUtils.getCurrentDate());
    const [meetScheduleMaxDate, setMeetScheduleMaxDate] = React.useState(DateUtils.getCurrentDate());

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
            <Grid container direction="column">
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.topGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات زمان‌بندی
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <ComboBox
                            options={PERSIAN_SCHEDULE_DURATIONS}
                            value={scheduleDurationMapToPersian(meetScheduleDuration)}
                            filterOptions={(options) => options} // do not filter values
                            onChange={(e, newValue) => setMeetScheduleDuration(scheduleDurationMapToEnglish(newValue))}
                            textFieldInputProps={{
                                label: "مدت‌زمان",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان شروع"}
                            selectedDate={meetScheduleMinDate}
                            onDateChange={date => setMeetScheduleMinDate(date)}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+10)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان پایان"}
                            selectedDate={meetScheduleMaxDate}
                            onDateChange={date => setMeetScheduleMaxDate(date)}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+10)}
                        />
                    </Grid>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <Button
                                // onClick={registerHandler}
                                variant="contained"
                                color="primary"
                            >
                                افزودن دانشگاه
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <CustomScheduler
                    height="550px"
                    minimumDate={meetScheduleMinDate}
                    maximumDate={meetScheduleMaxDate}
                    timeScaleInterval={30}
                    minimumDurationMinutes={meetScheduleDuration}
                    totalDaysInView={totalDaysInView}
                    selectedDate={startDate}
                    onDateChange={onDateChange}
                    scheduleEvents={problemScheduleEvents}
                    participants={participants}
                    onCellClick={onCellClick}
                    onEventDelete={onEventDelete}
                    onEventChange={onEventChange}
                />
            </Grid>
        </ThemeProvider>
    )
}

export default ProblemScheduleView;