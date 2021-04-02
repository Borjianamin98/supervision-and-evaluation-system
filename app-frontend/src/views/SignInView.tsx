import React, {FormEventHandler, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import signInImage from "../assets/images/signIn.png";
import {rtlTheme} from '../App';
import PasswordTextField from '../components/Text/PasswordTextField';
import AuthenticationService from "../services/api/AuthenticationService";
import {AxiosError} from "axios";

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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        color: theme.palette.error.main,
        margin: theme.spacing(2, 0),
    }
}));

const SignInView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        AuthenticationService.login(username, password)
            .then(() => setErrorMessage(""))
            .catch((reason: AxiosError) => {
                if (reason.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the validation range.
                    setErrorMessage("اطلاعات وارد شده صحیح نمی‌باشد. لطفا دوباره تلاش بفرمایید.")
                } else if (reason.request) {
                    // The request was made but no response was received
                    setErrorMessage("در ارتباط با سرور مشکلی می‌باشد. در صورت عدم رفع مشکل با مسئول پشتیبانی تماس بگیرید.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Unexpected error happened in request', reason.message);
                }
            });
    }

    return (
        <Grid container className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5">
                        ورود
                    </Typography>
                    <ThemeProvider theme={rtlTheme}>
                        <form dir="rtl" onSubmit={formSubmitHandler} className={classes.form} noValidate>
                            <TextField
                                dir="rtl"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="نام کاربری"
                                id="username"
                                name="username"
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
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="من را به خاطر بسپار"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                ورود
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        فراموشی رمز
                                    </Link>
                                </Grid>
                            </Grid>
                            <Typography hidden={!errorMessage} className={classes.error}>
                                {errorMessage}
                            </Typography>
                        </form>
                    </ThemeProvider>
                </div>
            </Grid>
        </Grid>
    );
}

export default SignInView;