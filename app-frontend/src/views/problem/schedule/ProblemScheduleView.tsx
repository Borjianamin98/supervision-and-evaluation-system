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
import Box from '@material-ui/core/Box';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import moment from 'moment';
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {rtlTheme} from '../../../App';
import CustomAlert from "../../../components/Alert/CustomAlert";
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomDatePicker from "../../../components/DatePicker/CustomDatePicker";
import CustomScheduler from "../../../components/Scheduler/CustomScheduler";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {DateRange} from "../../../model/schedule/event/DateRange";
import {ScheduleEvent, SyncfusionSchedulerEvent} from "../../../model/schedule/event/ScheduleEvent";
import {MeetScheduleSave} from '../../../model/schedule/MeetScheduleSave';
import {
    PERSIAN_SCHEDULE_DURATIONS,
    scheduleDurationMapToEnglish,
    scheduleDurationMapToPersian
} from "../../../model/schedule/ScheduleDuration";
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
    const {data: problemScheduleEvents} = useQuery(
        ["meetScheduleEvents", problem.meetSchedule.id, startDate, totalDaysInView],
        () => {
            const jwtPayloadUserId = AuthenticationService.getJwtPayloadUserId()!;
            const endDate = DateUtils.addDays(startDate, totalDaysInView);
            return ScheduleService.retrieveMeetScheduleEvents(problem.meetSchedule.id, startDate, endDate)
                .then(events => events.map(event => scheduleEventToSyncfusionSchedulerEvent(event, jwtPayloadUserId)))
        }
    );
    const updateMeetSchedule = useMutation(
        (data: { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }) =>
            ScheduleService.saveMeetSchedule(data.meetScheduleId, data.meetScheduleSave),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

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
            <Grid container direction="column">
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.topGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات زمان‌بندی
                        </Typography>
                        <CustomTypography lineHeight={2}>
                            برای جمع‌بندی و تحویل‌گرفتن نهایی پایان‌نامه (پروژه) دانشجو، نیاز به تشکیل جلسه‌ی دفاع و
                            ارائه‌ی دانشجو می‌باشد.
                            به این منظور لازم است که جلسه‌ای برای دفاع دانشجو از پایان‌نامه (پروژه) مشخص شود که در
                            آن تمامی اساتید داور، راهنما و دانشجو حضور داشته باشند.
                            پیدا کردن زمانی مشترک که همه‌ی افراد در آن حضور داشته باشند لازمه‌ی اصلی تشکیل جلسه
                            می‌باشد.
                            در این قسمت شما پس از مشخص‌کردن مواردی از جمله مدت زمان جلسه و محدوده‌ی زمانی مجاز
                            برای برگزاری آن، زمان‌های حضور خود را وارد می‌نمایید.
                            در ادامه شما و دیگر اساتید و دانشجو باید بر اساس موارد مشخص‌کرده، زمان‌های حضور خود را
                            اعلام نمایید.
                            با شروع زمان‌بندی اطلاعیه‌ای برای تمامی افراد ذینفع در فرایند زمان‌بندی ارسال می‌شود تا نسبت
                            به شروع فرآیند زمان‌بندی مطلع شوند.
                        </CustomTypography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <ComboBox
                            options={PERSIAN_SCHEDULE_DURATIONS}
                            value={scheduleDurationMapToPersian(Math.floor(problem.meetSchedule.durationMinutes / 30) * 30)}
                            filterOptions={(options) => options} // do not filter values
                            onChange={(e, newValue) => updateMeetSchedule.mutate({
                                meetScheduleId: problem.meetSchedule.id,
                                meetScheduleSave: {
                                    ...problem.meetSchedule,
                                    durationMinutes: scheduleDurationMapToEnglish(newValue),
                                }
                            })}
                            textFieldInputProps={{
                                label: "مدت زمان",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان شروع"}
                            selectedDate={moment(problem.meetSchedule.minimumDate)}
                            onDateChange={newValue => updateMeetSchedule.mutate({
                                meetScheduleId: problem.meetSchedule.id,
                                meetScheduleSave: {
                                    ...problem.meetSchedule,
                                    minimumDate: newValue.set({hour: 0, minute: 0, second: 0, millisecond: 0}).toDate(),
                                }
                            })}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+30)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان پایان"}
                            selectedDate={moment(problem.meetSchedule.maximumDate)}
                            onDateChange={newValue => updateMeetSchedule.mutate({
                                meetScheduleId: problem.meetSchedule.id,
                                meetScheduleSave: {
                                    ...problem.meetSchedule,
                                    maximumDate: newValue.set({hour: 23, minute: 59, second: 59, millisecond: 999})
                                        .toDate(),
                                }
                            })}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+30)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <CustomAlert
                            icon={<InfoOutlinedIcon/>}
                            severity="info"
                            variant="outlined"
                        >
                            <CustomTypography lineHeight={2}>
                                دقت شود که با شروع زمان‌بندی دفاع، امکان تغییر تنها زمان شروع و پایان دفاع امکان‌پذیر می‌شود.
                            </CustomTypography>
                        </CustomAlert>
                    </Grid>
                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}
                          justify={"center"}>
                        <Box marginTop={1}>
                            <Button
                                // onClick={registerHandler}
                                variant="contained"
                                color="primary"
                            >
                                شروع زمان‌بندی
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <CustomScheduler
                    height="550px"
                    minimumDate={problem.meetSchedule.minimumDate}
                    maximumDate={problem.meetSchedule.maximumDate}
                    timeScaleInterval={30}
                    minimumDurationMinutes={problem.meetSchedule.durationMinutes}
                    totalDaysInView={totalDaysInView}
                    onStartDateChange={date => setStartDate(date)}
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