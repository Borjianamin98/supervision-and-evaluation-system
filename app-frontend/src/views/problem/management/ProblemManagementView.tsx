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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import {rtlTheme} from "../../../App";
import KeywordsList from "../../../components/Chip/KeywordsList";
import SearchableListDialog from "../../../components/Dialog/SearchableListDialog";
import LoadingGrid from "../../../components/Grid/LoadingGrid";
import {generalErrorHandler} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {educationMapToPersian} from "../../../model/enum/education";
import {Role} from "../../../model/enum/role";
import {ProblemState} from "../../../model/problem/problemState";
import {Master} from "../../../model/user/master";
import AuthenticationService from "../../../services/api/AuthenticationService";
import ProblemAuthenticatedService from "../../../services/api/problem/ProblemAuthenticatedService";
import MasterService from "../../../services/api/user/MasterService";
import {mapNumberToPersianOrderName} from "../../../utility/numberUtils";
import {DASHBOARD_VIEW_PATH} from "../../ViewPaths";
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
        justifyAlign: {
            textAlign: "justify"
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

const ProblemManagementView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    function illegalAccessHandler(message?: string) {
        // Access illegal problem by user
        enqueueSnackbar(message ?? `دسترسی به مسئله مربوطه با توجه به سطح دسترسی شما امکان‌پذیر نمی‌باشد.`,
            {variant: "error"});
        browserHistory.push(DASHBOARD_VIEW_PATH);
    }

    const {problemId} = useParams<{ problemId: string }>();
    if (!(+problemId)) {
        illegalAccessHandler();
    }

    const queryClient = useQueryClient();
    const {
        data: problem,
        isLoading: isProblemLoading,
        isError: isProblemLoadingFailed
    } = useQuery(['problem', +problemId],
        () => {
            return ProblemAuthenticatedService.retrieveProblem(+problemId)
                .then(problem => {
                    if (problem.state !== ProblemState.IN_PROGRESS && problem.state !== ProblemState.COMPLETED) {
                        illegalAccessHandler("دسترسی به مسئله مربوطه با توجه به نوع مسئله امکان‌پذیر نمی‌باشد.");
                    }
                    return Promise.resolve(problem);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            illegalAccessHandler();
                        } else if (error.response.status === 404) {
                            illegalAccessHandler("مسئله مربوطه یافت نشد.")
                        }
                    }
                    return Promise.reject(error);
                })
        }, {
            keepPreviousData: true
        });
    const referees = problem?.referees;
    const updateReferees = useMutation(
        (data: Parameters<typeof MasterService.updateReferees>) => MasterService.updateReferees(data[0], data[1]),
        {
            onSuccess: async data => {
                queryClient.setQueryData(['problem', +problemId], data);
                await queryClient.invalidateQueries(['events', +problemId])
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [selectedRefereeDialog, setSelectedRefereeDialog] = React.useState(0);
    const [refereeDialogOpen, setRefereeDialogOpen] = React.useState(false);
    const onRefereeSelect = (master?: Master) => {
        if (master && referees) {
            if (referees.some(value => value.id! === master.id!)) {
                enqueueSnackbar(
                    "داور انتخاب‌شده در لیست داورهای از قبل انتخاب شده می‌باشد. امکان انتخاب یک داور برای بیش از یک بار وجود ندارد.",
                    {variant: "error"})
                return;
            } else if (master.id === problem!.supervisor?.id) {
                enqueueSnackbar(
                    "داور انتخاب‌شده نمی‌تواند استاد راهنمای مسئله باشد.",
                    {variant: "error"})
                return;
            }
            if (selectedRefereeDialog === -1) {
                updateReferees.mutate([+problemId, [...referees, master]]);
            } else {
                const copyReferees = [...referees];
                copyReferees[selectedRefereeDialog] = master;
                updateReferees.mutate([+problemId, copyReferees])
            }
        }
        setRefereeDialogOpen(false);
    }

    if (isProblemLoading || isProblemLoadingFailed) {
        return <ThemeProvider theme={rtlTheme}>
            <LoadingGrid
                isLoading={isProblemLoading}
                isError={isProblemLoadingFailed}
                onRetryClick={() => queryClient.invalidateQueries(["problem", +problemId])}
            />
        </ThemeProvider>
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem ? problem.student : undefined}
                                onEdit={() => undefined}
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
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`عنوان: ${problem?.title}`}</Typography>
                            <Typography paragraph className={classes.justifyAlign}>
                                {`عنوان انگلیسی: ${problem?.englishTitle}`}
                            </Typography>
                            <Typography paragraph>کلیدواژه‌ها: </Typography>
                            <Box marginBottom={2}>
                                <KeywordsList keywords={problem ? problem.keywords : []} marginDir="left"/>
                            </Box>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`تعریف: ${problem?.definition}`}</Typography>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`بیشینه: ${problem?.history}`}</Typography>
                            <Typography paragraph
                                        className={classes.justifyAlign}>{`ملاحظات: ${problem?.considerations}`}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <ProfileInfoCard
                                user={problem ? problem.supervisor : undefined}
                                onEdit={() => undefined}
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
                        <Box marginBottom={1}>
                            <Paper className={classes.columnContent}>
                                <Typography variant="h6" paragraph>
                                    داورها
                                </Typography>
                                {
                                    referees && [...Array(2)].map((e, index) => {
                                        let content: React.ReactNode;
                                        if (index < referees.length && referees[index] != null) {
                                            content = <ProfileInfoCard
                                                user={referees[index]}
                                                hasEdit={true}
                                                hasDelete={true}
                                                onEdit={() => {
                                                    setSelectedRefereeDialog(index);
                                                    setRefereeDialogOpen(true);
                                                }}
                                                onDelete={() => {
                                                    const copyReferees = [...referees];
                                                    copyReferees.splice(index, 1);
                                                    updateReferees.mutate([+problemId, copyReferees])
                                                }}
                                            />;
                                        } else {
                                            content = (
                                                <Button
                                                    fullWidth
                                                    startIcon={jwtPayloadRole !== Role.STUDENT &&
                                                    <PersonAddIcon style={{fontSize: 40}}/>}
                                                    className={classes.refereeSelectionButton}
                                                    onClick={() => {
                                                        setSelectedRefereeDialog(-1);
                                                        setRefereeDialogOpen(true);
                                                    }}
                                                    disabled={jwtPayloadRole === Role.STUDENT}
                                                >
                                                    {`داور ${mapNumberToPersianOrderName(index + 1)} مشخص نشده است.`}
                                                </Button>
                                            )
                                        }
                                        return <Box key={index} my={1}>
                                            {content}
                                        </Box>;
                                    })
                                }
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <Box px={4}>
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
                                        >
                                            زمان‌بندی مسئله
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
                        </Paper>
                    </Grid>
                </Grid>
                <div aria-label={"dialogs"}>
                    <ProblemAddEvent
                        open={commentDialogOpen}
                        problemId={+problemId}
                        problemTitle={problem ? problem.title : ""}
                        onClose={() => setCommentDialogOpen(false)}
                    />
                    <SearchableListDialog
                        title={`انتخاب استاد داور ${mapNumberToPersianOrderName(selectedRefereeDialog + 1)}`}
                        description={"استاد مربوطه را مشخص نمایید."}
                        open={refereeDialogOpen}
                        getItems={searchQuery => [
                            ['masters', searchQuery],
                            MasterService.retrieveMasters(100, 0, searchQuery).then(value => value.content)
                        ]}
                        getItemLabel={(item: Master) => item.fullName!}
                        getItemKey={(index, item) => item.id!}
                        onSelect={onRefereeSelect}
                    />
                </div>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemManagementView;