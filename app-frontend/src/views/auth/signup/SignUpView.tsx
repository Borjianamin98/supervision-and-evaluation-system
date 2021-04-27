import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {ClassNameMap} from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../../App';
import ButtonLink from "../../../components/Button/ButtonLink";
import {User} from "../../../model/user/user";
import UserService from "../../../services/api/UserService";
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

export interface SignUpSectionsProps {
    commonClasses: ClassNameMap,
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    errorChecking: boolean,
}

const SignUpView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const [user, setUser] = useState<User>(UserService.createInitialUser());
    const [errorChecking, setErrorChecking] = React.useState(false);

    const sectionProps: SignUpSectionsProps = {
        commonClasses,
        errorChecking,
        setUser,
        user,
    }

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        setErrorChecking(true);
    }

    return (
        <Container component="main" maxWidth={"lg"}>
            <ThemeProvider theme={rtlTheme}>
                <Paper dir="rtl" className={classes.root} elevation={6}>
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