import {Avatar, Box, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import {rtlTheme} from "../../../App";
import KeywordsList from "../../../components/Chip/KeywordsList";
import LoadingGrid from "../../../components/Grid/LoadingGrid";
import browserHistory from "../../../config/browserHistory";
import {educationMapToPersian} from "../../../model/enum/education";
import {ProblemState} from "../../../model/problem/problemState";
import {User, userRoleInfo} from "../../../model/user/user";
import ProblemAuthenticatedService from "../../../services/api/problem/ProblemAuthenticatedService";
import {DASHBOARD_VIEW_PATH} from "../../ViewPaths";
import ProblemEventsList from "../ProblemEventsList";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnContent: {
            padding: theme.spacing(4),
        },
        column: {
            padding: theme.spacing(1),
        },
        avatar: {
            width: 140,
            height: 140,
            margin: theme.spacing(0, 0, 2),
        },
        justifyAlign: {
            textAlign: "justify"
        },
        centerAlign: {
            textAlign: "center"
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

    const ProfileInfo: React.FunctionComponent<{ user?: User }> = ({user}) => {
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <Avatar src={""} className={classes.avatar}/>
                </Grid>
                <Grid item className={classes.centerAlign}>
                    <Typography variant="h5" paragraph>{user?.fullName}</Typography>
                    <Typography variant="h6">
                        {user ? userRoleInfo(user) : ""}
                    </Typography>
                </Grid>
            </Grid>
        )
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
                            <Paper className={classes.columnContent}>
                                <ProfileInfo user={problem ? problem.student : undefined}/>
                            </Paper>
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
                            <Paper className={classes.columnContent}>
                                <ProfileInfo user={problem ? problem.supervisor : undefined}/>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Typography variant="h6" paragraph>
                                رخدادهای اخیر
                            </Typography>
                            {
                                problem ? <ProblemEventsList problemId={problem.id!} pageSize={3}/> : undefined
                            }
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.column}>
                    <Paper className={classes.columnContent}>
                        <Typography variant="h6" paragraph>
                            اساتید
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default ProblemManagementView;