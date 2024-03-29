import {Box, Button, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCommentIcon from "@material-ui/icons/AddComment";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import SearchableListDialog from "../../../components/Dialog/SearchableListDialog";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {ProblemState} from "../../../model/problem/problemState";
import {MeetScheduleState} from "../../../model/schedule/MeetScheduleState";
import {Master} from "../../../model/user/master/Master";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";
import MasterService from "../../../services/api/user/MasterService";
import NumberUtils from "../../../utility/NumberUtils";
import ProfileInfoCard from "../../profile/ProfileInfoCard";
import ProblemEventsList from "../ProblemEventsList";
import ProblemInfoList from "../ProblemInfoList";
import ProblemAddEvent from "./PorblemAddEvent";
import ProblemManagementScheduleCard from "./ProblemManagementScheduleCard";
import ProblemManagementReviewCard from "./review/ProblemManagementReviewCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnContent: {
            padding: theme.spacing(4),
        },
        column: {
            padding: theme.spacing(1),
        },
        centerAlign: {
            textAlign: "center"
        },
        refereeSelectionButton: {
            borderStyle: "dashed",
            borderWidth: "3px",
            borderRadius: "0px",
            borderColor: theme.palette.action.active,
            height: 130,
        },
    }),
);

interface ProblemManagementViewProps {
    problem: Problem,
}

const ProblemManagementView: React.FunctionComponent<ProblemManagementViewProps> = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {problem} = props;

    const [refereeToRemoveConfirm, setRefereeToRemoveConfirm] = React.useState<Master | null>(null);
    const queryClient = useQueryClient();
    const addReferee = useMutation(
        (data: { problemId: number, refereeId: number }) =>
            ProblemMasterService.addReferee(data.problemId, data.refereeId),
        {
            onSuccess: async (data, {problemId}) => {
                queryClient.setQueryData<Problem>(['problem', problemId], data);
                await queryClient.invalidateQueries(["problemEvents", problemId])
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const removeReferee = useMutation(
        (data: { problemId: number, referee: Master, force: boolean }) =>
            ProblemMasterService.removeReferee(data.problemId, data.referee.id, data.force),
        {
            onSuccess: async (data, {problemId}) => {
                queryClient.setQueryData<Problem>(['problem', problemId], data);
                await queryClient.invalidateQueries(["problemEvents", problemId])
            },
            onError: (error: AxiosError, {referee}) => {
                if (error.response && error.response.status === 409 /* Conflict */) {
                    setRefereeToRemoveConfirm(referee);
                } else {
                    generalErrorHandler(error, enqueueSnackbar);
                }
            },
        });

    const jwtPayload = AuthenticationService.getJwtPayload()!;
    const currentUserIsSupervisor = problem.supervisor.id === jwtPayload.userId;

    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [refereeDialogOpen, setRefereeDialogOpen] = React.useState(false);
    const onRefereeSelect = (master?: Master) => {
        if (master) {
            if (problem.referees.some(value => value.id === master.id)) {
                enqueueSnackbar(
                    "داور انتخاب‌شده در لیست داورهای از قبل انتخاب شده می‌باشد. امکان انتخاب یک داور برای بیش از یک بار وجود ندارد.",
                    {variant: "error"})
                return;
            } else if (master.id === problem.supervisor.id) {
                enqueueSnackbar(
                    "داور انتخاب‌شده نمی‌تواند استاد راهنمای مسئله باشد.",
                    {variant: "error"})
                return;
            }
            addReferee.mutate({problemId: problem.id, refereeId: master.id});
        }
        setRefereeDialogOpen(false);
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem.student}
                                onDelete={() => undefined}
                                subheader="دانشجوی پایان‌نامه (پروژه)"
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Typography variant="h6" paragraph>
                                اطلاعات کلی
                            </Typography>
                            <ProblemInfoList problem={problem}/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem.supervisor}
                                onDelete={() => undefined}
                                subheader="استاد راهنمای پایان‌نامه (پروژه)"
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Grid container>
                                <Typography variant="h6">
                                    رخدادهای اخیر
                                </Typography>
                                <Box
                                    display={problem.state !== ProblemState.IN_PROGRESS ? "none" : "flex"}
                                    style={{marginRight: "auto"}}
                                >
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<AddCommentIcon/>}
                                        onClick={() => setCommentDialogOpen(true)}
                                    >
                                        ثبت نظر
                                    </Button>
                                </Box>
                            </Grid>
                            <Box marginTop={2}>
                                <ProblemEventsList problemId={problem.id} pageSize={4}/>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <Typography className={classes.centerAlign}>
                                داورها
                            </Typography>
                        </Box>
                        {
                            [...Array(problem.numberOfReferees)].map((e, index) => {
                                const orderString = NumberUtils.mapNumberToPersianOrderName(index + 1);
                                let content: React.ReactNode;
                                if (index < problem.referees.length) {
                                    content = <ProfileInfoCard
                                        user={problem.referees[index]}
                                        subheader={`داور ${orderString} پایان‌نامه (پروژه)`}
                                        hasDelete={
                                            currentUserIsSupervisor &&
                                            (problem.meetSchedule.state === MeetScheduleState.CREATED ||
                                                problem.meetSchedule.state === MeetScheduleState.STARTED)
                                        }
                                        onDelete={() =>
                                            removeReferee.mutate({
                                                problemId: problem.id,
                                                referee: problem.referees[index],
                                                force: false
                                            })}
                                    />;
                                } else {
                                    const buttonContent = currentUserIsSupervisor ?
                                        `تایین داور ${orderString}` :
                                        `داور ${orderString} مشخص نشده است.`;
                                    content = (
                                        <Button
                                            fullWidth
                                            startIcon={currentUserIsSupervisor ?
                                                (<PersonAddIcon style={{fontSize: 40}}/>) : undefined}
                                            className={classes.refereeSelectionButton}
                                            onClick={() => setRefereeDialogOpen(true)}
                                            disabled={!currentUserIsSupervisor}
                                        >
                                            {buttonContent}
                                        </Button>
                                    )
                                }
                                return <Box key={index} marginBottom={1}>
                                    {content}
                                </Box>;
                            })
                        }
                    </Grid>
                    <Grid item>
                        <Box component={Paper} padding={1} marginBottom={1}>
                            <Typography className={classes.centerAlign}>
                                عملیات
                            </Typography>
                        </Box>
                        <Grid container direction="row" spacing={1}>
                            <Grid item xs={12} sm={6} md={6} lg={12} xl={6}>
                                <ProblemManagementScheduleCard problem={problem}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={12} xl={6}>
                                <ProblemManagementReviewCard problem={problem}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div aria-label={"dialogs"}>
                    <ProblemAddEvent
                        open={commentDialogOpen}
                        problemId={problem.id}
                        onClose={() => setCommentDialogOpen(false)}
                        attachmentAllowed={true}
                    />
                    <SearchableListDialog
                        title={"انتخاب استاد داور"}
                        description={"استاد مربوطه را مشخص نمایید."}
                        open={refereeDialogOpen}
                        itemsQueryKey={searchQuery => ['masters', searchQuery]}
                        getItems={searchQuery =>
                            MasterService.retrieveMasters(100, 0, searchQuery).then(value => value.content)}
                        getItemLabel={(item: Master) => item.fullName}
                        getItemKey={(index, item) => item.id}
                        onSelect={onRefereeSelect}
                    />
                    <ConfirmDialog
                        open={refereeToRemoveConfirm !== null}
                        onAction={confirmed => {
                            if (confirmed && refereeToRemoveConfirm) {
                                removeReferee.mutate({
                                    problemId: problem.id,
                                    referee: refereeToRemoveConfirm,
                                    force: true
                                })
                            }
                            setRefereeToRemoveConfirm(null);
                        }}
                        title={"حذف داور"}
                        description={"داور انتخاب شده در زمان‌بندی دفاع پایان‌نامه (پروژه) مشارکت داشته هست. حذف او قابل بازگشت نمی‌باشد. آیا نسبت به این کار مطمئن هستید؟"}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemManagementView;