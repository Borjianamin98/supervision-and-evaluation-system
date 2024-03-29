import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import {ThemeProvider} from "@material-ui/core/styles";
import RestoreIcon from '@material-ui/icons/Restore';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../../App";
import CustomAlert from "../../../../components/Alert/CustomAlert";
import TooltipIconButton from "../../../../components/Button/TooltipIconButton";
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../../config/axios-config";
import {Problem} from "../../../../model/problem/problem";
import {User, userRoleInfo} from "../../../../model/user/User";
import ReviewService from "../../../../services/api/review/ReviewService";
import PointNumberTextField from "./PointNumberTextField";

interface ReviewConclusionDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const ReviewConclusionDialog: React.FunctionComponent<ReviewConclusionDialogProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const {problem, open, onClose} = props;

    // const jwtPayload = AuthenticationService.getJwtPayload()!;
    const finalizeProblemReview = useMutation(
        (data: { problemId: number, finalGrade: number }) =>
            ReviewService.finalizeProblemReview(data.problemId, data.finalGrade),
        {
            onSuccess: (data: Problem) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], data);
                queryClient.invalidateQueries(["problemEvents", problem.id]);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const [finalGrade, setFinalGrade] = React.useState(problem.finalGrade);
    React.useEffect(() => {
        setFinalGrade(problem.finalGrade);
    }, [problem.finalGrade])

    const isAllParticipantEvaluatedProblem = problem.problemReviews.length === problem.referees.length + 1;

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                open={open}
                onAction={reason => {
                    if (reason === "closed") {
                        onClose();
                    } else if (reason === "confirm") {
                        finalizeProblemReview.mutate({
                            problemId: problem.id,
                            finalGrade: finalGrade,
                        }, {
                            onSuccess: () => onClose(),
                        });
                    }
                }}
                title={"جمع‌بندی پایان‌نامه (پروژه)"}
                description={""}
                actions={[
                    {
                        content: "انصراف",
                        name: "closed",
                    },
                    {
                        content: "تایید",
                        name: "confirm",
                        disabled: !isAllParticipantEvaluatedProblem,
                    },
                ]}
            >
                <CustomTypography lineHeight={2}>
                    {
                        problem.problemReviews.length > 0 ? (
                            <Box display={"flex"} flexDirection={"column"}>
                                <CustomTypography lineHeight={2}>
                                    افراد زیر تاکنون ارزیابی‌های خود را در مورد پایان‌نامه (پروژه) مشخص کرده‌اند:
                                </CustomTypography>
                                <List>
                                    {problem.problemReviews.map(problemReview => (
                                        <PersonListItem
                                            key={problemReview.id}
                                            user={problemReview.reviewer}
                                        />
                                    ))}
                                </List>
                                {
                                    isAllParticipantEvaluatedProblem ? (
                                        <React.Fragment>
                                            <CustomTypography lineHeight={2}>
                                                تمامی افراد حاضر در جلسه‌ی دفاع، ارزیابی خود را در مورد پایان‌نامه
                                                (پروژه) تکمیل نموده‌اند. نمره‌ی نهایی دانشجو بر اساس اطلاعات وارد‌شده
                                                توسط داوران محترم به صورت زیر می‌باشد:
                                            </CustomTypography>
                                            <PointNumberTextField
                                                autoFocus
                                                label={"نمره نهایی"}
                                                value={finalGrade}
                                                onChange={(e) => setFinalGrade(+e.target.value)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <TooltipIconButton
                                                                tooltipTitle="مقدار پیش‌فرض"
                                                                onClick={() => setFinalGrade(problem.finalGrade)}>
                                                                <RestoreIcon/>
                                                            </TooltipIconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <CustomAlert severity="info">
                                                <CustomTypography lineHeight={2}>
                                                    توجه شود که نمره‌ی محاسبه‌شده بر اساس ارزیابی داوران جلسه می‌باشد.
                                                    تنها بر اساس جلسه‌ی شورا یا دیگر دلایل محکم اقدام به تغییر نمره‌ی
                                                    نهایی دانشجو کنید. همچنین این عمل برگشت‌پذیر نمی‌باشد.
                                                </CustomTypography>
                                            </CustomAlert>
                                        </React.Fragment>
                                    ) : (
                                        <CustomTypography lineHeight={2}>
                                            تمامی افراد حاضر در جلسه‌ی دفاع، ارزیابی خود را در مورد پایان‌نامه (پروژه)
                                            تکمیل نکرده‌اند. شما باید منتظر بمانید تا تمامی افراد ارزیابی خود را نهایی
                                            کنند. در صورت لزوم می‌توانید از بخش بحث‌های مربوط به مسئله، این موضوع را به
                                            افراد یادآوری کنید.
                                        </CustomTypography>
                                    )
                                }
                            </Box>
                        ) : (
                            <CustomTypography lineHeight={2}>
                                هیچ کدام از افراد حاضر در جلسه‌ی دفاع تاکنون ارزیابی خود از پایان‌نامه (پروژه)
                                دانشجو را مشخص نکرده‌اند.
                                بعد از وارد شدن ارزیابی تمام افراد، شما می‌توانید وضعیت نهایی پایان‌نامه (پروژه) را مشخص
                                نمایید.
                            </CustomTypography>
                        )
                    }
                </CustomTypography>
            </MultiActionDialog>
        </ThemeProvider>
    );
}

const PersonListItem: React.FunctionComponent<{ user: User }> = (props) => {
    const {user} = props;
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar/>
            </ListItemAvatar>
            <ListItemText
                primary={user.fullName}
                secondary={userRoleInfo(user)}
            />
        </ListItem>
    )
}

export default ReviewConclusionDialog;