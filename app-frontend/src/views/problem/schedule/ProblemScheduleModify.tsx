import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import purple from '@material-ui/core/colors/purple';
import teal from '@material-ui/core/colors/teal';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Theme, ThemeProvider} from "@material-ui/core/styles";
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import {AxiosError} from "axios";
import classNames from 'classnames';
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery} from "react-query";
import {rtlTheme} from '../../../App';
import CustomScheduler from "../../../components/Scheduler/CustomScheduler";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {DateRange} from "../../../model/schedule/event/DateRange";
import {ScheduleEvent, SyncfusionSchedulerEvent} from "../../../model/schedule/event/ScheduleEvent";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ScheduleService from "../../../services/api/schedule/ScheduleService";
import DateUtils from "../../../utility/DateUtils";
import ScheduleDateDialog from "./ScheduleDateDialog";

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
    commonClasses: ClassNameMap,
    problem: Problem,
}

const ProblemScheduleView: React.FunctionComponent<ProblemScheduleViewProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem, commonClasses} = props;

    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const smallScreenMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const totalDaysInView = mobileMatches ? 3 : (smallScreenMatches ? 5 : 7);

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;

    const [startDate, setStartDate] = React.useState(DateUtils.getCurrentDate());
    const {data: problemScheduleEvents} = useQuery(
        ["meetScheduleEvents", problem.meetSchedule.id, startDate, totalDaysInView],
        () => {
            const jwtPayloadUserId = AuthenticationService.getJwtPayloadUserId()!;
            const endDate = DateUtils.addDays(startDate, totalDaysInView);
            return ScheduleService.retrieveMeetScheduleEvents(problem.meetSchedule.id, startDate, endDate)
                .then(events => events.map(event => scheduleEventToSyncfusionSchedulerEvent(event, jwtPayloadUserId)))
        }
    );

    const [scheduleDateDialogOpen, setScheduleDateDialogOpen] = React.useState(false);

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
                <Grid
                    container dir="rtl"
                    component={Paper}
                    elevation={4}
                    className={commonClasses.topGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={commonClasses.gridItem}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات زمان‌بندی
                        </Typography>
                        <CustomTypography lineHeight={2}>
                            برای جمع‌بندی و تحویل‌گرفتن نهایی پایان‌نامه (پروژه) دانشجو، نیاز به تشکیل جلسه‌ی دفاع و
                            ارائه‌ی دانشجو می‌باشد.
                            به این منظور لازم است که جلسه‌ای برای دفاع دانشجو از پایان‌نامه (پروژه) مشخص شود که در
                            آن تمامی اساتید داور، راهنما و دانشجو حضور داشته باشند.
                            پیدا کردن زمانی مشترک که همه‌ی افراد در آن حضور داشته باشند لازمه‌ی اصلی تشکیل جلسه می‌باشد.
                            در این قسمت شما در کنار دیگران، زمان‌های حضور خود را وارد می‌نمایید.
                            بهتر است پس از آن که زمان‌بندی خود را به صورت کامل مشخص نمودید، نهایی‌شدن آن را اعلام نمایید
                            تا تمامی افراد ذینفع در فرایند زمان‌بندی نسبت به آن مطلع شوند.
                        </CustomTypography>
                    </Grid>
                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} className={commonClasses.gridItem}
                          justify={"center"} spacing={1} style={{marginTop: 8}}>
                        <Grid item className={commonClasses.gridItem}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classNames({
                                    [commonClasses.hidden]: !currentUserIsSupervisor
                                })}
                            >
                                درخواست تعیین زمان دوباره از همه
                            </Button>
                        </Grid>
                        <Grid item className={commonClasses.gridItem}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classNames({
                                    [commonClasses.hidden]: !currentUserIsSupervisor
                                })}
                            >
                                تایین زمان دفاع
                            </Button>
                        </Grid>
                        <Grid item className={commonClasses.gridItem}>
                            <Button
                                onClick={() => setScheduleDateDialogOpen(true)}
                                variant="contained"
                                color="primary"
                                className={classNames({
                                    [commonClasses.hidden]: !currentUserIsSupervisor
                                })}
                            >
                                ویرایش بازه زمان‌بندی
                            </Button>
                        </Grid>
                        <Grid item className={commonClasses.gridItem}>
                            <Button
                                variant="contained"
                                color="primary"
                            >
                                اعلام نهایی‌شدن
                            </Button>
                        </Grid>
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
                <div aria-label={"dialogs"}>
                    <ScheduleDateDialog
                        problem={problem}
                        open={scheduleDateDialogOpen}
                        onDialogClose={() => setScheduleDateDialogOpen(false)}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    )
}

export default ProblemScheduleView;