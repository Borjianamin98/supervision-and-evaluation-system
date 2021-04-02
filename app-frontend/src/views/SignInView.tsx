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
import browserHistory from '../config/browserHistory';

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
}));

const SignInView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
        AuthenticationService.login(username, password);
        if (AuthenticationService.isAuthenticated()) {
            browserHistory.push("/dashboard")
        }
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
                                label="آدرس ایمیل"
                                id="email"
                                name="email"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="email"
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
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        ساخت حساب کاربری
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </ThemeProvider>
                </div>
            </Grid>
        </Grid>
    );
}

export default SignInView;