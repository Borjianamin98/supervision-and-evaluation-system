import Button from "@material-ui/core/Button";
import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from "../../../../App";
import conclusionImage from "../../../../assets/images/schedule/Conclusion.jpg";
import MediaCard from "../../../../components/MediaCard/MediaCard";
import {Problem} from "../../../../model/problem/problem";
import {ProblemState} from "../../../../model/problem/problemState";
import {MeetScheduleState} from "../../../../model/schedule/MeetScheduleState";
import AuthenticationService from "../../../../services/api/AuthenticationService";
import LocaleUtils from "../../../../utility/LocaleUtils";
import ReviewConclusionDialog from "./ReviewConclusionDialog";
import ReviewEvaluationDialog from "./ReviewEvaluationDialog";

interface ProblemManagementReviewCardProps {
    problem: Problem,
}

const ProblemManagementReviewCard: React.FunctionComponent<ProblemManagementReviewCardProps> = (props) => {
    const {problem} = props;

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;
    const currentUserIsStudent = problem.student.id === jwtPayload.userId;

    const [evaluationDialogOpen, setEvaluationDialogOpen] = React.useState(false);
    const [conclusionDialogOpen, setConclusionDialogOpen] = React.useState(false);

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
                if (problem.state === ProblemState.COMPLETED) {
                    return [
                        `نمره‌ی نهایی پایان‌نامه (پروژه) به تایید استاد راهنما، 
                        ${LocaleUtils.convertToPersianDigits(problem.finalGrade.toFixed(2).toString())}
                         می‌باشد.`
                    ]
                } else {
                    const sharedInfo = "جلسه‌ی دفاع در زمان مقرر با حضور تمامی اعضا تشکیل شده است. ";
                    if (currentUserIsStudent) {
                        return ["نمره‌ی پایا‌ن‌نامه (پروژه) هنوز توسط داوران نهایی نشده است."]
                    } else if (currentUserIsSupervisor) {
                        return [
                            sharedInfo +
                            "وضعیت پایان‌نامه (پروژه) دانشجو را با توجه به ارزیابی خود در جلسه‌ی دفاع وارد نمایید.",
                            (problem.problemReviews.length === problem.referees.length + 1 ?
                                "تمامی اساتید نمرات و جمع‌بندی‌های خود را وارد نموده‌اند. از بخش جمع‌بندی، وضعیت نهایی را تایید کنید." :
                                "هنوز تعدادی از اساتید وضعیت نهایی پایا‌ن‌نامه (پروژه) را مشخص نکرده‌اند. " +
                                "در صورت لزوم می‌توانید این مورد را یادآوری کنید.")
                        ]
                    } else {
                        return [
                            sharedInfo +
                            "داوران محترم از بخش نمره‌دهی، اطلاعات لازم را در مورد پایان‌نامه (پروژه) مشخص کنند.",
                            "پس از واردشدن نمرات و جمع‌بندی توسط تمامی داورها، وضعیت نهایی پایان‌نامه (پروژه) توسط استاد راهنما تایید می‌شود."
                        ]
                    }
                }
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.state);
        }
    }

    const reviewMediaActions = () => {
        switch (problem.meetSchedule.state) {
            case MeetScheduleState.CREATED:
            case MeetScheduleState.STARTED:
            case MeetScheduleState.FINALIZED:
            case MeetScheduleState.REJECTED:
                return null;
            case MeetScheduleState.ACCEPTED:
                if (problem.state === ProblemState.COMPLETED || currentUserIsStudent) {
                    return null;
                } else {
                    const evaluationAction = <Button
                        disabled={problem.problemReviews.some(review => review.reviewer.id === jwtPayload.userId)}
                        color="primary"
                        onClick={() => setEvaluationDialogOpen(true)}
                    >
                        ارزیابی
                    </Button>
                    if (currentUserIsSupervisor) {
                        return <>
                            {evaluationAction}
                            <Button
                                color="primary"
                                onClick={() => setConclusionDialogOpen(true)}
                            >
                                جمع‌بندی
                            </Button>
                        </>
                    } else {
                        return evaluationAction;
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
                <ReviewEvaluationDialog
                    problem={problem}
                    open={evaluationDialogOpen}
                    onClose={() => setEvaluationDialogOpen(false)}
                />
                <ReviewConclusionDialog
                    problem={problem}
                    open={conclusionDialogOpen}
                    onClose={() => setConclusionDialogOpen(false)}
                />
            </div>
        </ThemeProvider>
    );
}

export default ProblemManagementReviewCard;