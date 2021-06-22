import Button from "@material-ui/core/Button";
import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from "../../../App";
import conclusionImage from "../../../assets/images/schedule/Conclusion.jpg";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import MediaCard from "../../../components/MediaCard/MediaCard";
import {Problem} from "../../../model/problem/problem";
import {ProblemState} from "../../../model/problem/problemState";
import {MeetScheduleState} from "../../../model/schedule/MeetScheduleState";
import AuthenticationService from "../../../services/api/AuthenticationService";

interface ProblemManagementReviewCardProps {
    problem: Problem,
}

const ProblemManagementReviewCard: React.FunctionComponent<ProblemManagementReviewCardProps> = (props) => {
    const {problem} = props;

    const [finalizeProblemDialogOpen, setFinalizeProblemDialogOpen] = React.useState(false);

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;
    const currentUserIsStudent = problem.student.id === jwtPayload.userId;

    const reviewMediaContent = () => {
        switch (problem.meetSchedule.state) {
            case MeetScheduleState.CREATED:
            case MeetScheduleState.STARTED:
            case MeetScheduleState.FINALIZED:
                return [
                    "جلسه‌ی دفاع مربوط به پاپیان‌نامه (پروژه) هنوز تشکیل نشده است. " +
                    currentUserIsStudent ?
                        "بعد از برگزاری جلسه‌ی دفاع و واردشدن نتایج آن توسط داورها، " +
                        "شما می‌توانید وضعیت نهایی مسئله خود را در این قسمت مشاهده کنید." :
                        "بعد از برگزاری جلسه‌ی دفاع، اساتید می‌توانند از این بخش نمرات و کارهای نهایی‌کردن مسئله را پیش ببرند."
                ]
            case MeetScheduleState.REJECTED:
                return [
                    "جلسه دفاع به علت یکسری دلایل (مانند عدم حضور دانشجو و ...) تشکیل نشده است. " +
                    "با توجه به عدم تشکیل جلسه، پایان‌نامه (پروژه) به صورت ردشده در نظر گرفته‌شده و نمره‌نهایی آن صفر می‌باشد،"];
            case MeetScheduleState.ACCEPTED:
                return [
                    "جلسه‌ی دفاع در زمان مقرر با حضور تمامی اعضا تشکیل شده است. " +
                    problem.state === ProblemState.COMPLETED ?
                        `نمره‌ی نهایی پایان‌نامه (پروژه) مربوطه ${problem.finalGrade} می‌باشد.` :
                        (currentUserIsStudent ?
                            "نمره‌ی پاپا‌ن‌نامه (پروژه) هنوز توسط داوران نهایی نشده است."
                            : "داوران از بخش نمره‌دهی، اطلاعات لازم را در مورد پایان‌نامه (پروژه) مشخصص کنند.")
                ];
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.state);
        }
    }

    const reviewMediaActions = () => {
        switch (problem.meetSchedule.state) {
            case MeetScheduleState.CREATED:
            case MeetScheduleState.STARTED:
            case MeetScheduleState.REJECTED:
            case MeetScheduleState.FINALIZED:
                return null;
            case MeetScheduleState.ACCEPTED:
                if (problem.state === ProblemState.COMPLETED || currentUserIsStudent) {
                    return null;
                } else {
                    if (currentUserIsSupervisor) {
                        return <>
                            <Button
                                disabled={false}
                                color="primary"
                            >
                                نمره‌دهی
                            </Button>
                            <Button
                                disabled={false}
                                color="primary"
                                onClick={() => setFinalizeProblemDialogOpen(true)}
                            >
                                جمع‌بندی
                            </Button>
                        </>
                    } else {
                        return <Button
                            disabled={false}
                            color="primary"
                        >
                            نمره‌دهی
                        </Button>
                    }
                }
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.state);
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <MediaCard
                media={conclusionImage}
                mediaHeight={100}
                title={"جمع‌بندی"}
                subTitle={reviewMediaContent()}
            >
                {reviewMediaActions()}
            </MediaCard>
            <div aria-label={"dialogs"}>
                <ConfirmDialog
                    open={finalizeProblemDialogOpen}
                    onDialogOpenClose={confirmed => {
                        if (confirmed) {
                            // TODO
                        }
                        setFinalizeProblemDialogOpen(false);
                    }}
                    title={"جمع‌بندی"}
                    description={""}
                />
            </div>
        </ThemeProvider>
    );
}

export default ProblemManagementReviewCard;