import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useSnackbar} from "notistack";
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../../App';
import ButtonLink from "../../../components/Button/ButtonLink";
import {generalErrorHandler} from "../../../config/axios-config";
import browserHistory from "../../../config/browserHistory";
import {ENGLISH_ROLES, Role} from "../../../model/enum/role";
import {Faculty} from "../../../model/university/faculty/faculty";
import {MasterSaveSpecialInfo} from "../../../model/user/master/MasterSave";
import {StudentSaveSpecialInfo} from "../../../model/user/student/StudentSave";
import {UserSave} from "../../../model/user/UserSave";
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

type ExtraUserSaveInfo = MasterSaveSpecialInfo & StudentSaveSpecialInfo & { role: Role };

export interface SignUpSectionsProps {
    commonClasses: ClassNameMap,
    userSave: UserSave,
    updateUser: (user: UserSave) => void,
    faculty?: Faculty,
    updateFaculty: (faculty?: Faculty) => void,
    extraUserSaveInfo: ExtraUserSaveInfo,
    updateExtraUserSaveInfo: (extraUserSaveInfo: ExtraUserSaveInfo) => void,
    errorChecking: boolean,
}

const SignUpView: React.FunctionComponent = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [errorChecking, setErrorChecking] = React.useState(false);

    const [userSave, setUserSave] = useState<UserSave>(UserService.createInitialUserSave());
    const [extraUserSaveInfo, setExtraUserSaveInfo] = useState<ExtraUserSaveInfo>(
        {degree: "", studentNumber: "", facultyId: 0 /* Not Used */, role: ENGLISH_ROLES[0]});
    const [faculty, setFaculty] = useState<Faculty>();

    const sectionProps: SignUpSectionsProps = {
        commonClasses,
        errorChecking,
        userSave,
        updateUser: userSave => setUserSave(userSave),
        faculty,
        updateFaculty: faculty => setFaculty(faculty),
        extraUserSaveInfo,
        updateExtraUserSaveInfo: extraUserSaveInfo => setExtraUserSaveInfo(extraUserSaveInfo),
    }

    const handleSuccessSubmit = () => {
        enqueueSnackbar("حساب کاربری با موفقیت ایجاد شد.", {variant: "success"});
        browserHistory.push(LOGIN_VIEW_PATH);
    }

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        if (!UserService.isUserValid(userSave) || !faculty) {
            setErrorChecking(true);
            return;
        }
        if (extraUserSaveInfo.role === Role.STUDENT
            && StudentService.isStudentNumberValid(extraUserSaveInfo.studentNumber)) {
            StudentService.register({
                ...userSave,
                studentNumber: extraUserSaveInfo.studentNumber,
                facultyId: faculty.id
            })
                .then(() => handleSuccessSubmit())
                .catch(error => generalErrorHandler(error, enqueueSnackbar))
        } else if (extraUserSaveInfo.role === Role.MASTER && extraUserSaveInfo.degree.length !== 0) {
            MasterService.register({
                ...userSave,
                degree: extraUserSaveInfo.degree,
                facultyId: faculty.id
            })
                .then(() => handleSuccessSubmit())
                .catch(error => generalErrorHandler(error, enqueueSnackbar))
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