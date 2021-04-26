import {Container} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import update from 'immutability-helper';
import React, {FormEventHandler, useState} from 'react';
import {rtlTheme} from '../../App';
import ButtonLink from "../../components/Button/ButtonLink";
import ComboBox from "../../components/ComboBox/ComboBox";
import CustomTextField from "../../components/Text/CustomTextField";
import PasswordTextField from '../../components/Text/PasswordTextField';
import {genderMapToEnglish, genderMapToPersian, PERSIAN_GENDERS} from "../../model/enum/gender";
import {User} from "../../model/user/user";
import UserService from "../../services/api/UserService";
import {LOGIN_VIEW_PATH} from "../ViewPaths";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(8, 3, 3),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(3, 1, 1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        margin: theme.spacing(4, 0, 3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    button: {
        maxWidth: 200,
    }
}));

const SignUpView: React.FunctionComponent = (props) => {
    const classes = useStyles();
    const [user, setUser] = useState<User>(UserService.createInitialUser());
    // const [errorMessage, setErrorMessage] = useState<string>("");

    const formSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();
    }

    const setPhoneNumber = (telephoneNumber: string) => {
        setUser(update(user, {personalInfo: {telephoneNumber: () => telephoneNumber}}))
    }

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNumbers.length < 10) {
            setPhoneNumber(onlyNumbers);
        } else if (onlyNumbers.length === 10) {
            const number = onlyNumbers.replace(
                /(\d{3})(\d{3})(\d{4})/,
                '$1 $2 $3'
            );
            setPhoneNumber(number);
        }
    }

    return (
        <Container component="main" maxWidth={"lg"}>
            <ThemeProvider theme={rtlTheme}>
                <Paper dir="rtl" className={classes.root} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5">
                        ثبت نام
                    </Typography>
                    <form onSubmit={formSubmitHandler} className={classes.form} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Typography variant="h6">
                                    مشخصات عمومی
                                </Typography>
                                <CustomTextField
                                    required
                                    label="نام"
                                    value={user.firstName}
                                    onChange={(e) =>
                                        setUser({...user, firstName: e.target.value})}
                                />
                                <CustomTextField
                                    required
                                    label="نام خانوادگی"
                                    value={user.lastName}
                                    onChange={(e) =>
                                        setUser({...user, lastName: e.target.value})}
                                />
                                <ComboBox
                                    options={PERSIAN_GENDERS}
                                    value={genderMapToPersian(user.personalInfo!.gender)}
                                    onChange={(e, newValue) =>
                                        setUser(update(user, {
                                            personalInfo: {
                                                gender: () => genderMapToEnglish(newValue),
                                            }
                                        }))
                                    }
                                    inputProps={{
                                        label: "جنسیت"
                                    }}
                                />
                                <CustomTextField
                                    textDirection={"ltr"}
                                    required
                                    label="شماره تلفن"
                                    value={user.personalInfo!.telephoneNumber}
                                    onChange={(e) => handlePhoneNumberChange(e)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">98+</InputAdornment>,
                                    }}
                                />
                                <CustomTextField
                                    textDirection={"ltr"}
                                    required
                                    label="آدرس ایمیل"
                                    value={user.personalInfo!.email}
                                    onChange={(e)  =>
                                        setUser(update(user, {
                                            personalInfo: {
                                                email: () => e.target.value,
                                            }
                                        }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Typography variant="h6">
                                    حساب کاربری
                                </Typography>
                                <CustomTextField
                                    required
                                    label="نام کاربری"
                                    autoComplete="username"
                                    value={user.username}
                                    onChange={(e) =>
                                        setUser({...user, username: e.target.value})}
                                />
                                <PasswordTextField
                                    dir="rtl"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="رمز عبور"
                                    value={user.password}
                                    onChange={(e) =>
                                        setUser({...user, password: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container justify={"center"} spacing={2}>
                        <Grid item>
                            <Button
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