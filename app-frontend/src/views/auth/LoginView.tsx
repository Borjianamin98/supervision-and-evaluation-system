import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {AxiosError} from "axios";
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../App';
import signInImage from "../../assets/images/signIn.png";
import ButtonLink from "../../components/Button/ButtonLink";
import CustomTextField from "../../components/Text/CustomTextField";
import PasswordTextField from '../../components/Text/PasswordTextField';
import {getGeneralErrorMessage} from "../../config/axios-config";
import AuthenticationService from "../../services/api/AuthenticationService";
import {SIGNUP_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${signInImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submitButton: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        margin: theme.spacing(2, 0),
    }
}));

const LoginView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");



    const clearFormInputs = () => {
        setUsername("");
        setPassword("");
    };

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        AuthenticationService.login(username, password)
            .then(() => setErrorMessage(""))
            .catch((error: AxiosError) => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                setErrorMessage(statusCode ? "اطلاعات وارد شده صحیح نمی‌باشد. لطفا دوباره تلاش بفرمایید." : message);
                clearFormInputs();
            });
    }

    return (
        <Grid container className={classes.root}>
            <Grid item xs={false} sm={5} md={7} className={classes.image}/>
            <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5">
                        ورود
                    </Typography>
                    <ThemeProvider theme={rtlTheme}>
                        <form dir="rtl" onSubmit={formSubmitHandler} className={classes.form} noValidate>
                            <CustomTextField
                                required
                                label="نام کاربری"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="username"
                            />
                            <PasswordTextField
                                dir="rtl"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="رمز عبور"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submitButton}
                            >
                                ورود
                            </Button>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="secondary"
                                    >
                                        فراموشی رمز
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <ButtonLink
                                        to={SIGNUP_VIEW_PATH}
                                        variant="contained"
                                        fullWidth
                                        color="secondary"
                                    >
                                        ثبت نام
                                    </ButtonLink>
                                </Grid>
                            </Grid>
                            <Typography hidden={!errorMessage} color="error" className={classes.error}>
                                {errorMessage}
                            </Typography>
                        </form>
                    </ThemeProvider>
                </div>
            </Grid>
        </Grid>
    );
}

export default LoginView;