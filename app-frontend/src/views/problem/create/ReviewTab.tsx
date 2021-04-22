import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import React from 'react';
import KeywordsList from "../../../components/Chip/KeywordsList";
import browserHistory from "../../../config/browserHistory";
import ProblemService from "../../../services/api/ProblemService";
import {PROBLEM_OBSERVATION_PATH} from "../../ViewPaths";
import {ProblemTabProps} from "./ProblemCreateView";

const useStyles = makeStyles((theme) => ({
    gridItem: {
        padding: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(1),
    },
    buttons: {
        display: "flex",
        justifyContent: 'center',
        margin: theme.spacing(2),
    }
}));

const ReviewTab: React.FunctionComponent<ProblemTabProps> = (props) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {commonClasses, problem, setErrorChecking} = props;

    const submitProblemCreation = () => {
        setErrorChecking(true);
        if (ProblemService.validateInitialProblem(problem)) {
            ProblemService.sendCreateProblem(problem)
                .then(() => browserHistory.push(PROBLEM_OBSERVATION_PATH))
                .catch(() => enqueueSnackbar("ایجاد مسئله ناموفق بود. بعد از بررسی اطلاعات، دوباره تلاش نمایید.",
                    {variant: "error"}))
        } else {
            enqueueSnackbar("تمامی اطلاعات لازم ارائه نشده است. بعد از اصلاح موارد لازم، دوباره تلاش نمایید.",
                {variant: "error"})
        }
    }

    return (
        <Grid container dir="rtl" alignItems="stretch" justify="center">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">دوره تحصیلی:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>{problem.education}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">عنوان فارسی:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>
                                {problem.title.length === 0 ? "عنوانی مشخص نشده است." : problem.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">عنوان انگلیسی:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>
                                {problem.englishTitle.length === 0 ? "عنوانی مشخص نشده است." : problem.englishTitle}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">کلیدواژه‌ها:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <KeywordsList keywords={problem.keywords}>کلیدواژه‌ای ارائه نشده است.</KeywordsList>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography variant="h6">استاد راهنما:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.gridItem}>
                            <Typography>
                                {problem.supervisor ?
                                    `${problem.supervisor.firstName} ${problem.supervisor.lastName}` : "استاد راهنما مشخص نشده است."}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Paper square elevation={3} className={commonClasses.paper}>
                    <Typography className={classes.gridItem} variant="h6">تعریف مسئله و نیازمندی</Typography>
                    <Typography className={classes.gridItem}>
                        {problem.definition.length === 0 ? "تعریف مسئله مشخص نشده است." : problem.englishTitle}
                    </Typography>
                    <Typography className={classes.gridItem} variant="h6">پیشینه مسئله</Typography>
                    <Typography className={classes.gridItem}>
                        {problem.history && problem.history?.length > 0 ?
                            problem.history : "بیشینه ارائه نشده است."}
                    </Typography>
                    <Typography className={classes.gridItem} variant="h6">ملاحظات</Typography>
                    <Typography className={classes.gridItem}>
                        {problem.considerations && problem.considerations?.length > 0 ?
                            problem.considerations : "ملاحظات ارائه نشده است."}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submitProblemCreation}
                    >
                        تایید و ارسال
                    </Button>
                </div>

            </Grid>
        </Grid>
    );
}

export default ReviewTab;