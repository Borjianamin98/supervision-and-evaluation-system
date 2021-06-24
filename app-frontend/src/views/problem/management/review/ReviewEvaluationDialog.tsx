import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import {ThemeProvider} from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../../App";
import CustomAlert from "../../../../components/Alert/CustomAlert";
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CenterBox from "../../../../components/Grid/CenterBox";
import CustomTextField from "../../../../components/Text/CustomTextField";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../../config/axios-config";
import {Problem} from "../../../../model/problem/problem";
import {PeerReviewSave} from "../../../../model/review/peer/PeerReviewSave";
import {ProblemReviewSave} from "../../../../model/review/ProblemReviewSave";
import {User, userRoleInfo} from "../../../../model/user/User";
import AuthenticationService from "../../../../services/api/AuthenticationService";
import ReviewService from "../../../../services/api/review/ReviewService";
import PointNumberTextField from "./PointNumberTextField";

interface ReviewEvaluationDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const convertUserToPeerReview = (users: User[]) => {
    return users.map<PeerReviewSave>(user => ({
        content: "",
        score: 0,
        reviewedId: user.id,
    }))
}

const ReviewEvaluationDialog: React.FunctionComponent<ReviewEvaluationDialogProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const {problem, open, onClose} = props;

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const steps = ["پایان‌نامه (پروژه)", "ارزیابی همکار"];

    const reviewProblem = useMutation(
        (data: { problemId: number, problemReviewSave: ProblemReviewSave }) =>
            ReviewService.reviewProblem(data.problemId, data.problemReviewSave),
        {
            onSuccess: (data: Problem) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], data);
                queryClient.invalidateQueries(["problemEvents", problem.id]);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const candidatePeers = [...problem.referees, problem.supervisor]
        .filter(user => user.id !== jwtPayload.userId);

    const [activeStep, setActiveStep] = React.useState(0);
    const [problemScore, setProblemScore] = React.useState(0);
    const [peerReviewSaves, setPeerReviewSaves] = React.useState<PeerReviewSave[]>(convertUserToPeerReview(candidatePeers));

    React.useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setProblemScore(0);
            setPeerReviewSaves(convertUserToPeerReview(candidatePeers));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const isPeerReviewValid = (peerReviewSave: PeerReviewSave) => peerReviewSave.content.length > 0;

    const stepperContent = () => {
        if (activeStep === 0) {
            return <>
                <CustomTypography lineHeight={2} boxProps={{marginBottom: 1}}>
                    جلسه دفاع پایان‌نامه (پروژه) در تاریخ مقرر تشکیل شده است.
                    با توجه به جلسه‌ی برگزار شده، ارزیابی خود را بر مبنای کیفیت ارائه‌ی دانشجو، موضوع پایا‌ن‌نامه
                    (پروژه)، میزان پیشرفت دانشجو و ... مورد بررسی قرار داده و در نهایت نمره‌ی نهایی دانشجو را وارد
                    نمایید.
                </CustomTypography>
                <CustomAlert severity="info">
                    <CustomTypography lineHeight={2}>
                        هیچ‌کدام از افراد دیگر در پایان‌نامه (پروژه) ارزیابی شما را مشاهده نمی‌کنند و این اطلاعات به
                        صورت خودکار در انتهای فرآیند برای محاسبه‌ی نمره‌ی نهایی دانشجو استفاده می‌شود.
                    </CustomTypography>
                </CustomAlert>
                <PointNumberTextField
                    autoFocus
                    label={"نمره نهایی"}
                    value={problemScore}
                    onChange={(e) => setProblemScore(+e.target.value)}
                />
            </>;
        } else if (activeStep === 1) {
            return <>
                <CustomTypography lineHeight={2} boxProps={{marginBottom: 1}}>
                    نحوه‌ی عملکرد اساتید دیگر در پیش‌برد پایان‌نامه (پروژه) و جلسه‌ی دفاع، از جمله اطلاعات مفیدی است
                    که می‌تواند در انتخاب اساتید در دوره‌های بعدی، شناخت اساتید مدعو و ... مفید باشد.
                    ممنون می‌شویم که بخشی از زمان پرارزشتان را برای پرکردن اطلاعات زیر در مورد دیگر اساتید صرف کنید
                    به امید این که بازخوردهای شما بتواند در بهبود پایان‌نامه (پروژه‌) و جلسات آینده مفید واقع شود.
                </CustomTypography>
                <List>
                    {peerReviewSaves.map((peerReviewSave, index) => (
                        <div key={peerReviewSave.reviewedId}>
                            <PersonReviewListItem
                                user={candidatePeers[index]}
                                peerReviewSave={peerReviewSave}
                                updatePeerReviewSave={peerReviewSave => {
                                    const copy = peerReviewSaves.slice();
                                    copy[index] = peerReviewSave;
                                    setPeerReviewSaves(copy);
                                }}
                            />
                            <Divider component={"li"}/>
                        </div>
                    ))}
                </List>
            </>
        } else {
            return null;
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                open={open}
                onAction={reason => {
                    if (reason === "closed") {
                        onClose();
                    } else if (reason === "next") {
                        setActiveStep(prev => prev + 1);
                    } else if (reason === "previous") {
                        setActiveStep(prev => prev - 1);
                    } else if (reason === "confirm") {
                        reviewProblem.mutate({
                            problemId: problem.id,
                            problemReviewSave: {
                                score: problemScore,
                                peerReviews: peerReviewSaves,
                            }
                        }, {
                            onSuccess: () => onClose(),
                        });
                    }
                }}
                title={"ارزیابی پایان‌نامه (پروژه)"}
                description={""}
                actions={[
                    {
                        content: "قسمت قبل",
                        name: "previous",
                        disabled: activeStep === 0
                    },
                    {
                        content: "قسمت بعد",
                        name: "next",
                        disabled: activeStep === 1
                    },
                    {
                        content: "تایید",
                        name: "confirm",
                        disabled: activeStep === 0 || peerReviewSaves.some(p => !isPeerReviewValid(p))
                    },
                ]}
            >
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {stepperContent()}
            </MultiActionDialog>
        </ThemeProvider>
    );
}

interface PersonReviewListItemProps {
    user: User,
    peerReviewSave: PeerReviewSave,
    updatePeerReviewSave: (PeerReviewSave: PeerReviewSave) => void,
}

const PersonReviewListItem: React.FunctionComponent<PersonReviewListItemProps> = (props) => {
    const {user, peerReviewSave, updatePeerReviewSave} = props;

    const isBlank = (c?: string) => !c || c.length === 0;

    return (
        <ListItem>
            <ListItemText
                disableTypography={true}
            >
                <CustomTypography>{user.fullName}</CustomTypography>
                <CustomTypography>{userRoleInfo(user)}</CustomTypography>
                <CustomTextField
                    required
                    label="نظرات"
                    maxLength={255}
                    multiline={true}
                    rows={3}
                    value={peerReviewSave.content}
                    onChange={event => updatePeerReviewSave({...peerReviewSave, content: event.target.value})}
                    helperText={isBlank(peerReviewSave.content) ? "نظر حداقلی در مورد همکار الزامی می‌باشد." : ""}
                />
                <CenterBox flexDirection={"row"} justifyContent={"space-between"}>
                    <CustomTypography>امتیازدهی:</CustomTypography>
                    <Rating
                        name={`rating-${user.id}`}
                        size="large"
                        value={peerReviewSave.score}
                        onChange={(event, newValue) => updatePeerReviewSave({...peerReviewSave, score: newValue ?? 0})}
                    />
                </CenterBox>
            </ListItemText>
        </ListItem>
    )
}

export default ReviewEvaluationDialog;