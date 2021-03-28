import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
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
import {IconButton} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";

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

const SignIn: React.FunctionComponent = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
                        <form dir="rtl" action="/" method="get" className={classes.form} noValidate>
                            <TextField
                                dir="rtl"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="آدرس ایمیل"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(prevState => !prevState)}
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                dir="rtl"
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="رمز عبور"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="current-password"
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

export default SignIn;