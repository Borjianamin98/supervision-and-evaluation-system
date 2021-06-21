import {Button} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import {AxiosError} from "axios";
import moment from "jalali-moment";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import meetScheduleImage from "../../../assets/images/schedule/MeetSchedule.jpg";
import ButtonLink from "../../../components/Button/ButtonLink";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import MediaCard from "../../../components/MediaCard/MediaCard";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {MeetScheduleState} from "../../../model/schedule/MeetScheduleState";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ScheduleService from "../../../services/api/schedule/ScheduleService";
import {PROBLEM_SCHEDULE_VIEW_PATH} from "../../ViewPaths";

interface ProblemManagementScheduleCardProps {
    problem: Problem,
}

const ProblemManagementScheduleCard: React.FunctionComponent<ProblemManagementScheduleCardProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const {problem} = props;

    const [rejectFinalizedMeetScheduleDialogOpen, setRejectFinalizedMeetScheduleDialogOpen] = React.useState(false);
    const rejectFinalizedMeetSchedule = useMutation(
        (data: number) =>
            ScheduleService.rejectFinalizedMeetSchedule(data),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
                queryClient.invalidateQueries(["problemEvents", problem.id]);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;

    const schedulingMediaContent = () => {
        switch (problem.meetSchedule.state) {
            case MeetScheduleState.CREATED:
                if (currentUserIsSupervisor) {
                    if (problem.referees.length === 2) {
                        return ["شرایط لازم برای زمان‌بندی و تعیین جلسه‌ی دفاع فراهم می‌باشد. " +
                        "شما می‌توانید زمانی که به برگزاری جلسه دفاع نزدیک می‌شود، " +
                        "زمان‌بندی مسئله را شروع کنید تا زمانی مشترک برای برگزاری جلسه دفاع مشخص کنید."];
                    } else {
                        return ["داورهای پروژه (پایان‌نامه) مشخص نشده‌اند. " +
                        "پیش از شروع به تشکیل جلسه‌ی دفاع باید تمامی داورها مشخص شده باشند."];
                    }
                } else {
                    return ["برگزاری جلسه دفاع پایان‌نامه (پروژه) هنوز شروع نشده است. " +
                    "شما می‌توانید بعد از این که امکان زمان‌بندی جلسه دفاع توسط استاد راهنما فعال شد، از این قسمت زمان‌های حضور و هماهنگی‌های لازم را انجام دهید."]
                }
            case MeetScheduleState.STARTED:
                if (problem.referees.length === 2) {
                    return ["برنامه‌ریزی جلسه‌ی دفاع پایان‌نامه (پروژه) شروع شده است. " +
                    "تمامی افرادی که باید در جلسه حاضرشوند، زمان‌های حضور خود را برای تعیین تاریخ دفاع مشخص نمایند."];
                } else {
                    return ["تعدادی از داورهای مسئله بعد از شروع برنامه‌ریزی برای جلسه دفاع به دلایلی حذف گردیده‌اند. " +
                    "برای زمان‌بندی و مشخص‌کردن جلسه‌ی دفاع باید ابتدا تمامی داورهای مسئله مشخص شوند. " +
                    "با توجه به شروع برنامه‌ریزی جلسه دفاع، در تعیین به موقع داورهای جایگزین مسئله اقدام کنید."];
                }
            case MeetScheduleState.FINALIZED:
                const finalizedDate = new Date(problem.meetSchedule.finalizedDate!);
                const finalizedMoment = moment(finalizedDate).locale('fa')
                    .format('ddd، D MMMM YYYY (h:mm a)');
                const finalizedDateIsAfterNow = moment(finalizedDate).isAfter(moment(new Date()));
                const finalizeFromNow = moment(finalizedDate).locale('fa').fromNow();

                return [
                    `زمان جلسه دفاع در تاریخ ${finalizedMoment} می‌باشد.`,
                    finalizedDateIsAfterNow ?
                        `${finalizeFromNow} آینده جلسه دفاع تشکیل خواهد شد.` :
                        `${finalizeFromNow} جلسه دفاع تشکیل شده است.`,
                    !finalizedDateIsAfterNow && !currentUserIsSupervisor ?
                        "زمان برگزاری جلسه دفاع به اتمام رسیده است. منتظر بررسی استاد راهنما برای تایید برگزاری جلسه باشید." :
                        "",
                ];
            case MeetScheduleState.FINISHED:
                if (problem.meetSchedule.meetingHeld) {
                    return [""];
                } else {
                    return ["جلسه دفاع به علت یکسری دلایل (مانند عدم حضور دانشجو و ...) تشکیل نشد. " +
                    "با توجه به این که علت عدم برگزاری جلسه سبب عدم ارزیابی مناسب در ادامه می‌شود، " +
                    "نتیجه این پایان‌نامه (پروژه) به صورت ردشده در نظر گرفته شد."];
                }
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.state);
        }
    }

    const schedulingMediaActions = () => {
        switch (problem.meetSchedule.state) {
            case MeetScheduleState.CREATED:
                if (currentUserIsSupervisor && problem.referees.length === 2) {
                    return <ButtonLink to={`${PROBLEM_SCHEDULE_VIEW_PATH}/${problem.id}`} color="primary">
                        شروع برنامه‌ریزی جلسه دفاع
                    </ButtonLink>;
                } else {
                    return null;
                }
            case MeetScheduleState.STARTED:
                if (problem.referees.length === 2) {
                    return <ButtonLink to={`${PROBLEM_SCHEDULE_VIEW_PATH}/${problem.id}`} color="primary">
                        برنامه‌ریزی جلسه دفاع
                    </ButtonLink>;
                } else {
                    return null;
                }
            case MeetScheduleState.FINALIZED:
                const finalizedDate = new Date(problem.meetSchedule.finalizedDate!);
                const finalizedDateIsAfterNow = moment(finalizedDate).isAfter(moment(new Date()));
                if (currentUserIsSupervisor) {
                    return <>
                        <Button
                            disabled={finalizedDateIsAfterNow}
                            color="primary"
                        >
                            تایید برگزاری جلسه
                        </Button>
                        <Button
                            disabled={finalizedDateIsAfterNow}
                            color="primary"
                            onClick={() => setRejectFinalizedMeetScheduleDialogOpen(true)}
                        >
                            اعلام تشکیل‌نشدن جلسه
                        </Button>
                    </>
                } else {
                    return null;
                }
            case MeetScheduleState.FINISHED:
                return null;
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.state);
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <MediaCard
                media={meetScheduleImage}
                mediaHeight={100}
                title={"جلسه دفاع"}
                subTitle={schedulingMediaContent()}
            >
                {schedulingMediaActions()}
            </MediaCard>
            <div aria-label={"dialogs"}>
                <ConfirmDialog
                    open={rejectFinalizedMeetScheduleDialogOpen}
                    onDialogOpenClose={confirmed => {
                        if (confirmed) {
                            rejectFinalizedMeetSchedule.mutate(problem.meetSchedule.id);
                        }
                        setRejectFinalizedMeetScheduleDialogOpen(false);
                    }}
                    title={"اعلام تشکیل‌نشدن جلسه"}
                    description={"در صورتی که به دلایلی که از سمت دانشجو می‌باشد، جلسه دفاع برگزار نشده است، " +
                    "شما می‌توانید جلسه دفاع را تشکیل‌نشده اعلام کنید. با اعلان تشکیل‌نشدن جلسه، نمره دانشجو برای پایان‌نامه (پروژه) صفر خواهد بود. " +
                    "این عمل بازگشت‌پذیر نمی‌باشد."}
                />
            </div>
        </ThemeProvider>
    );
}

export default ProblemManagementScheduleCard;