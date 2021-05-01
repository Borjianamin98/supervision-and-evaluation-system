import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../../App';
import ButtonLink from "../../../components/Button/ButtonLink";
import {getGeneralErrorMessage} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {ENGLISH_ROLES, Role} from "../../../model/enum/role";
import {Faculty} from "../../../model/university/faculty";
import {MasterSpecialInfo} from "../../../model/user/master";
import {StudentSpecialInfo} from "../../../model/user/student";
import {User} from "../../../model/user/user";
import FacultyService from "../../../services/api/faculty/FacultyService";
import MasterService from "../../../services/api/user/MasterService";
import StudentService from "../../../services/api/user/StudentService";
import UserService from "../../../services/api/user/UserService";
import {LOGIN_VIEW_PATH} from "../../ViewPaths";
import SignUpGeneralInfo from "./SignUpGeneralInfo";
import SignUpUniversityInfo from "./SignUpUniversityInfo";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3, 3),
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

type ExtraUserInfo = MasterSpecialInfo & StudentSpecialInfo & { role: Role };

export interface SignUpSectionsProps {
    commonClasses: ClassNameMap,
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    faculty: Faculty,
    setFaculty: React.Dispatch<React.SetStateAction<Faculty>>,
    extraUserInfo: ExtraUserInfo,
    setExtraUserInfo: React.Dispatch<React.SetStateAction<ExtraUserInfo>>,
    errorChecking: boolean,
}

const SignUpView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const [user, setUser] = useState<User>(UserService.createInitialUser());
    const [faculty, setFaculty] = useState<Faculty>(FacultyService.createInitialFaculty());
    const [extraUserInfo, setExtraUserInfo] = useState<ExtraUserInfo>(
        {degree: "", studentNumber: "", role: ENGLISH_ROLES[0]});
    const [errorChecking, setErrorChecking] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const sectionProps: SignUpSectionsProps = {
        commonClasses,
        errorChecking,
        setUser,
        user,
        faculty,
        setFaculty,
        extraUserInfo,
        setExtraUserInfo
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
        if (!UserService.isUserValid(user)) {
            setErrorChecking(true);
            return;
        }
        if (extraUserInfo.role === Role.STUDENT && StudentService.isStudentNumberValid(extraUserInfo.studentNumber)) {
            StudentService.registerStudent({
                student: {
                    ...user,
                    studentNumber: extraUserInfo.studentNumber,
                },
                facultyId: faculty.id!
            }).then(value => handleSuccessSubmit()).catch(error => handleFailedSubmit(error))
        } else if (extraUserInfo.role === Role.MASTER && extraUserInfo.degree.length > 1) {
            MasterService.registerMaster({
                master: {
                    ...user,
                    degree: extraUserInfo.degree,
                },
                facultyId: faculty.id!
            }).then(value => handleSuccessSubmit()).catch(error => handleFailedSubmit(error))
        } else {
            setErrorChecking(true);
        }
    }

    return (
        <Container dir="rtl" component="main" maxWidth={"lg"}>
            <ThemeProvider theme={rtlTheme}>
                <Paper className={classes.root} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography className={classes.buttonMargin} variant="h5">
                        ثبت نام
                    </Typography>
                    <Grid container spacing={3} className={classes.buttonMargin}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <SignUpGeneralInfo {...sectionProps}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <SignUpUniversityInfo {...sectionProps}/>
                        </Grid>
                    </Grid>
                    <Grid container justify={"center"} spacing={2}>
                        <Grid item>
                            <Button
                                onClick={formSubmitHandler}
                                variant="contained"
                                color="primary"
                            >
                                ایجاد حساب کاربری
                            </Button>
                        </Grid>
                        <Grid item>
                            <ButtonLink
                                to={LOGIN_VIEW_PATH}
                                variant="contained"
                                color="primary"
                            >
                                بازگشت به صفحه ورود
                            </ButtonLink>
                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Container>
    );
}

export default SignUpView;