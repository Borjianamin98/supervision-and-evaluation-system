import {Avatar, Box, Grid, Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import {rtlTheme} from "../../../App";
import KeywordsList from "../../../components/Chip/KeywordsList";
import browserHistory from "../../../config/browserHistory";
import {educationMapToPersian} from "../../../model/enum/education";
import {ProblemEvent} from "../../../model/problem/problemEvent";
import {ProblemState} from "../../../model/problem/problemState";
import ProblemAuthenticatedService from "../../../services/api/problem/ProblemAuthenticatedService";
import ProblemStudentService from "../../../services/api/problem/ProblemStudentService";
import EventInfoCard from "../../../services/api/university/EventInfoCard";
import {DASHBOARD_VIEW_PATH} from "../../ViewPaths";

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
    const {data: problem, ...problemQuery} = useQuery(['problem', +problemId],
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
            initialData: () => ProblemStudentService.createInitialProblem(),
            keepPreviousData: true
        });

    const events = problem?.events.sort((a, b) =>
        new Date(a.createdDate!).valueOf() - new Date(b.createdDate!).valueOf())
        .reverse()
        .slice(0, 10)
        .map((event: ProblemEvent) =>
            <Box my={1}>
                <EventInfoCard header={event.createdBy!} body={event.message} date={event.createdDate!}/>
            </Box>
        );

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container direction="row">
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.column}>
                    <Paper className={classes.columnContent}>
                        <Typography variant="h6" paragraph>
                            اطلاعات کلی
                        </Typography>
                        <Typography paragraph>
                            {`دوره تحصیلی: ${problem ? educationMapToPersian(problem.education) : ""}`}
                        </Typography>
                        <Typography paragraph className={classes.justifyAlign}>{`عنوان: ${problem?.title}`}</Typography>
                        <Typography paragraph
                                    className={classes.justifyAlign}>{`عنوان انگلیسی: ${problem?.englishTitle}`}</Typography>
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
                <Grid container item direction="column" xs={12} sm={12} md={12} lg={4} xl={4}
                      className={classes.column}>
                    <Grid item>
                        <Box marginBottom={1}>
                            <Paper className={classes.columnContent}>
                                <Grid container direction="column" alignItems="center">
                                    <Grid item>
                                        <Avatar src={""} className={classes.avatar}/>
                                    </Grid>
                                    <Grid item className={classes.centerAlign}>
                                        <Typography variant="h5" paragraph>{problem?.supervisor?.fullName}</Typography>
                                        <Typography variant="h6">
                                            {`استاد ${problem?.supervisor?.facultyName} دانشگاه ${problem?.supervisor?.universityName}`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.columnContent}>
                            <Typography variant="h6" paragraph>
                                رخدادهای اخیر
                            </Typography>
                            {events ?? <EventInfoCard header={"سامانه"} body={"رخدادی وجود ندارد."}/>}
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