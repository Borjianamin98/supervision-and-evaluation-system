import {Box, Button, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddCommentIcon from "@material-ui/icons/AddComment";
import GradeIcon from '@material-ui/icons/Grade';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import KeywordsList from "../../../components/Chip/KeywordsList";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import SearchableListDialog from "../../../components/Dialog/SearchableListDialog";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {educationMapToPersian} from "../../../model/enum/education";
import {Problem} from "../../../model/problem/problem";
import {ScheduleState} from "../../../model/schedule/ScheduleState";
import {Master} from "../../../model/user/master/Master";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemMasterService from "../../../services/api/problem/ProblemMasterService";
import MasterService from "../../../services/api/user/MasterService";
import NumberUtils from "../../../utility/NumberUtils";
import {PROBLEM_SCHEDULE_VIEW_PATH} from "../../ViewPaths";
import ProblemEventsList from "../ProblemEventsList";
import ProblemAddEvent from "./PorblemAddEvent";
import ProfileInfoCard from "./ProfileInfoCard";

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

    const onScheduleClick = () => {
        browserHistory.push({
            pathname: `${PROBLEM_SCHEDULE_VIEW_PATH}/${problem.id}`,
            state: problem
        });
    }

    const meetScheduleEnabled = () => {
        switch (problem.meetSchedule.scheduleState) {
            case ScheduleState.CREATED:
                return currentUserIsSupervisor && problem.referees.length === 2;
            case ScheduleState.STARTED:
                return problem.referees.length === 2;
            case ScheduleState.FINALIZED:
                return false;
            default:
                throw new Error("Illegal problem meet schedule state: " + problem.meetSchedule.scheduleState);
        }
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
                            <Typography paragraph>
                                {`دوره تحصیلی: ${problem ? educationMapToPersian(problem.education) : ""}`}
                            </Typography>
                            <CustomTypography paragraph>{`عنوان: ${problem?.title}`}</CustomTypography>
                            <CustomTypography paragraph>
                                {`عنوان انگلیسی: ${problem?.englishTitle}`}
                            </CustomTypography>
                            <Typography paragraph>کلیدواژه‌ها: </Typography>
                            <Box marginBottom={2}>
                                <KeywordsList keywords={problem ? problem.keywords : []} marginDir="left"/>
                            </Box>
                            <CustomTypography paragraph>{`تعریف: ${problem?.definition}`}</CustomTypography>
                            <CustomTypography paragraph>{`بیشینه: ${problem?.history}`}</CustomTypography>
                            <CustomTypography paragraph>{`ملاحظات: ${problem?.considerations}`}</CustomTypography>
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
                                <Box style={{marginRight: "auto"}}>
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
                                {problem ? <ProblemEventsList problemId={problem.id!} pageSize={3}/> : undefined}
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
                            [...Array(2)].map((e, index) => {
                                const orderString = NumberUtils.mapNumberToPersianOrderName(index + 1);
                                let content: React.ReactNode;
                                if (index < problem.referees.length) {
                                    content = <ProfileInfoCard
                                        user={problem.referees[index]}
                                        subheader={`داور ${orderString} پایان‌نامه (پروژه)`}
                                        hasDelete={currentUserIsSupervisor && problem.meetSchedule.scheduleState !== ScheduleState.FINALIZED}
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
                        <Box component={Paper} px={4} marginTop={1}>
                            <Grid container spacing={1} className={classes.columnContent}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Typography variant="h6" className={classes.centerAlign} paragraph>
                                        عملیات
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<ScheduleIcon/>}
                                        onClick={onScheduleClick}
                                        disabled={!meetScheduleEnabled()}
                                    >
                                        زمان‌بندی دفاع
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<GradeIcon/>}
                                    >
                                        نمره‌دهی
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <div aria-label={"dialogs"}>
                    <ProblemAddEvent
                        open={commentDialogOpen}
                        problemId={problem.id}
                        problemTitle={problem.title}
                        onClose={() => setCommentDialogOpen(false)}
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
                        onDialogOpenClose={confirmed => {
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