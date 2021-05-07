import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import {rtlTheme} from '../../../App';
import {getGeneralErrorMessage} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {Problem} from "../../../model/problem/problem";
import ProblemService from "../../../services/api/ProblemService";
import {PROBLEM_LIST_VIEW_PATH} from "../../ViewPaths";
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

enum EditState {
    ADD,
    EDIT,
    REVIEW
}

const ProblemEdit: React.FunctionComponent = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const location = useLocation();

    const [errorChecking, setErrorChecking] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    let initialProblem = ProblemService.createInitialProblem();
    let initialEditState = EditState.ADD;
    if (location.state) {
        initialProblem = location.state as Problem;
        initialEditState = EditState.EDIT;
    }
    const [problem, setProblem] = useState<Problem>(initialProblem);
    const [editState, setEditState] = useState<EditState>(initialEditState);
    const [oldEditState, setOldEditState] = useState<EditState>(initialEditState);

    const sectionProps: ProblemEditSectionsProps = {
        commonClasses,
        errorChecking,
        problem,
        updateProblem: newProblem => setProblem(newProblem),
    }

    const avatarIcon = (editState: EditState) => {
        switch (editState) {
            case EditState.ADD:
                return <AddOutlinedIcon/>;
            case EditState.EDIT:
                return <EditOutlinedIcon/>;
            case EditState.REVIEW:
                return <VisibilityOutlinedIcon/>;
        }
    }

    const avatarTitle = (editState: EditState) => {
        switch (editState) {
            case EditState.ADD:
                return "تعریف پایان‌نامه (پروژه)";
            case EditState.EDIT:
                return "ویرایش پایان‌نامه (پروژه)";
            case EditState.REVIEW:
                return "بازبینی";
        }
    }

    const pageContent = (editState: EditState) => {
        switch (editState) {
            case EditState.ADD:
            case EditState.EDIT:
                return (
                    <>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ProblemEditGeneralInfo {...sectionProps}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <ProblemEditExtraInfo {...sectionProps}/>
                        </Grid>
                    </>
                )
            case EditState.REVIEW:
                return (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <ProblemEditReview {...sectionProps}/>
                    </Grid>
                );
        }
    }

    const submitContent = (editState: EditState) => {
        switch (editState) {
            case EditState.ADD:
            case EditState.EDIT:
                return "تایید اطلاعات"
            case EditState.REVIEW:
                return "ارسال اطلاعات";
        }
    }


    const handleSuccessSubmit = (editState: EditState) => {
        let message: string;
        switch (editState) {
            case EditState.ADD:
                message = "پایان‌نامه (پروژه) با موفقیت ایجاد شد.";
                break;
            case EditState.EDIT:
                message = "پایان‌نامه (پروژه) با موفقیت ویرایش شد.";
                break;
            default:
                throw new Error("Unexpected call for this state: " + editState)
        }
        enqueueSnackbar(message, {variant: "success"});
        browserHistory.push(PROBLEM_LIST_VIEW_PATH)
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

    const submitHandler = () => {
        switch (editState) {
            case EditState.ADD:
            case EditState.EDIT:
                if (!ProblemService.isValidProblem(problem)) {
                    setErrorChecking(true);
                    return;
                }
                setOldEditState(editState)
                setEditState(EditState.REVIEW)
                break;
            case EditState.REVIEW:
                if (oldEditState === EditState.ADD) {
                    ProblemService.sendCreateProblem(problem)
                        .then(() => handleSuccessSubmit(oldEditState))
                        .catch((error) => handleFailedSubmit(error));
                } else if (oldEditState === EditState.EDIT) {
                    ProblemService.updateProblem(problem.id!, problem)
                        .then(() => handleSuccessSubmit(oldEditState))
                        .catch((error) => handleFailedSubmit(error));
                }
                break;
        }
    }

    const formButton = (content: string, onClick: () => void) => {
        return (
            <Grid item>
                <Button
                    onClick={event => {
                        event.preventDefault();
                        onClick();
                    }}
                    variant="contained"
                    color="primary"
                >
                    {content}
                </Button>
            </Grid>
        )
    }

    return (
        <Container dir="rtl" component="main" maxWidth={false}>
            <ThemeProvider theme={rtlTheme}>
                <Paper className={classes.root} elevation={6}>
                    <Avatar className={classes.avatar}>
                        {avatarIcon(editState)}
                    </Avatar>
                    <Typography className={classes.buttonMargin} variant="h5">
                        {avatarTitle(editState)}
                    </Typography>
                    <Grid container spacing={3} className={classes.buttonMargin}>
                        {pageContent(editState)}
                    </Grid>
                    <Grid container justify={"center"} spacing={2}>
                        {editState === EditState.EDIT ?
                            formButton("انصراف", () => browserHistory.goBack()) : undefined}
                        {editState === EditState.REVIEW ?
                            formButton("ویرایش اطلاعات", () => setEditState(oldEditState)) : undefined}
                        {formButton(submitContent(editState), submitHandler)}
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Container>
    );
}

export default ProblemEdit;