import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../../App';
import {getGeneralErrorMessage} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {Problem} from "../../../model/problem";
import ProblemService from "../../../services/api/ProblemService";
import {LOGIN_VIEW_PATH, PROBLEM_OBSERVATION_PATH} from "../../ViewPaths";
import ProblemEditExtraInfo from "./ProblemEditExtraInfo";
import ProblemEditGeneralInfo from "./ProblemEditGeneralInfo";
import ProblemEditReview from "./ProblemEditReview";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(3, 1, 1),
        backgroundColor: theme.palette.secondary.main,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    buttonMargin: {
        margin: theme.spacing(0, 0, 2),
    }
}));

const useCommonStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(1, 0),
    }
}));

export interface ProblemEditSectionsProps {
    commonClasses: ClassNameMap,
    problem: Problem,
    updateProblem: (problem: Problem) => void
    errorChecking: boolean,
}

const ProblemEdit: React.FunctionComponent = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const [problem, setProblem] = useState<Problem>(ProblemService.createInitialProblem());
    const [errorChecking, setErrorChecking] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const sectionProps: ProblemEditSectionsProps = {
        commonClasses,
        errorChecking,
        problem,
        updateProblem: newProblem => setProblem(newProblem),
    }

    const handleSuccessSubmit = () => {
        enqueueSnackbar("حساب کاربری با موفقیت ایجاد شد.", {variant: "success"});
        browserHistory.push(LOGIN_VIEW_PATH);
    }

    const handleFailedSubmit = (error: AxiosError) => {
        const {statusCode, message} = getGeneralErrorMessage(error);
        if (statusCode) {
            enqueueSnackbar(`در ارسال درخواست از سرور خطای ${statusCode} دریافت شد.`,
                {variant: "error"});
        } else if (!statusCode) {
            enqueueSnackbar(message, {variant: "error"});
        }
    }

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        if (!ProblemService.isValidProblem(problem)) {
            setErrorChecking(true);
            return;
        }
        ProblemService.sendCreateProblem(problem)
            .then(() => browserHistory.push(PROBLEM_OBSERVATION_PATH))
            .catch(() => enqueueSnackbar("ایجاد مسئله ناموفق بود. بعد از بررسی اطلاعات، دوباره تلاش نمایید.",
                {variant: "error"}));
    }

    return (
        <Container dir="rtl" component="main" maxWidth={false}>
            <ThemeProvider theme={rtlTheme}>
                <Paper className={classes.root} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <AddOutlinedIcon/>
                    </Avatar>
                    <Typography className={classes.buttonMargin} variant="h5">
                        تعریف پایان‌نامه (پروژه)
                    </Typography>
                    <Grid container spacing={3} className={classes.buttonMargin}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ProblemEditGeneralInfo {...sectionProps}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ProblemEditExtraInfo {...sectionProps}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ProblemEditReview {...sectionProps}/>
                        </Grid>
                    </Grid>
                    <Grid container justify={"center"} spacing={2}>
                        <Grid item>
                            <Button
                                onClick={formSubmitHandler}
                                variant="contained"
                                color="primary"
                            >
                                تایید اطلاعات
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Container>
    );
}

export default ProblemEdit;