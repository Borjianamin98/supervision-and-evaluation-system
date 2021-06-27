import {Avatar, Badge, Grid, IconButton, Paper} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles, Theme, ThemeProvider} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import classNames from "classnames";
import {useSnackbar} from "notistack";
import React, {useState} from 'react';
import {rtlTheme} from "../../App";
import InputFileIconButton from "../../components/Input/InputFileIconButton";
import CustomTextField, {CustomTextFieldProps} from "../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../config/axios-config";
import browserHistory from "../../config/browserHistory";
import {genderMapToPersian} from "../../model/enum/gender";
import {Role} from "../../model/enum/role";
import {User, userRoleInfo} from "../../model/user/User";
import AuthenticationService from "../../services/api/AuthenticationService";
import AdminService from "../../services/api/user/AdminService";
import MasterService from "../../services/api/user/MasterService";
import StudentService from "../../services/api/user/StudentService";
import UserService from "../../services/api/user/UserService";
import {resizeImage} from "../../utility/image-resize";
import {ERROR_VIEW_PATH, LOGIN_VIEW_PATH} from "../ViewPaths";

const PROFILE_PICTURE_MIME_TYPES = ["image/png", "image/jpeg"];
const PROFILE_PICTURE_MAX_SIZE = 500;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typography: {
            padding: theme.spacing(1),
        },
        gridItem: {
            padding: theme.spacing(2),
        },
        avatar: {
            width: 140,
            height: 140,
        },
        centerAlign: {
            textAlign: "center"
        },
        imageIcon: {
            display: "flex",
            justifyContent: "center"
        },
    }),
);

const ProfileView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [avatar, setAvatar] = useState<string>("");
    const [user, setUser] = useState<User>();

    React.useEffect(() => {
        AuthenticationService.check()
            .then(async () => {
                const jwtPayloadRole = AuthenticationService.getJwtPayloadRole()!;
                if (jwtPayloadRole === Role.STUDENT) {
                    return await StudentService.retrieveStudentInfo();
                } else if (jwtPayloadRole === Role.MASTER) {
                    return await MasterService.retrieveAuthenticatedMaster();
                } else if (jwtPayloadRole === Role.ADMIN) {
                    return await AdminService.retrieveAdminInfo();
                } else {
                    throw new Error("Unexpected user role: " + jwtPayloadRole)
                }
            })
            .then(value => setUser(value))
            .catch(() => {
                // Invalid JWT token provided for authentication
                AuthenticationService.logout();
                browserHistory.push(LOGIN_VIEW_PATH);
            })
    }, []);

    React.useEffect(() => {
        UserService.retrieveUserProfilePicture()
            .then(value => setAvatar(window.URL.createObjectURL(value.data)))
            .catch(error => {
                const {statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت تصویر از سرور خطای ${statusCode} دریافت شد.`,
                        {variant: "error"});
                } else if (!statusCode) {
                    browserHistory.push(ERROR_VIEW_PATH);
                }
            });
    }, [enqueueSnackbar])

    const onFileChangeHandler = (selectedFile: File) => {
        if (!PROFILE_PICTURE_MIME_TYPES.some(acceptType => selectedFile.type.match(acceptType))) {
            enqueueSnackbar('فایل انتخابی باید تصویری با فرمت مناسب باشد.', {variant: "error"});
            return;
        }

        resizeImage(selectedFile, PROFILE_PICTURE_MAX_SIZE, true)
            .then(resizedImageBlob => {
                const formData = new FormData();
                const file = new File([resizedImageBlob], "profile");
                formData.append('file', file);
                return UserService.sendUserProfilePicture(formData)
                    .then(() => resizedImageBlob)
                    .catch(err => {
                        const {message, statusCode} = getGeneralErrorMessage(err);
                        enqueueSnackbar(statusCode ?
                            `در ارسال تصویر به سرور خطای ${statusCode} دریافت شد.` : message,
                            {variant: "error"});
                        return Promise.reject(err);
                    });
            })
            .then(resizedImageBlob => setAvatar(window.URL.createObjectURL(resizedImageBlob)));
    }

    const commonTextFieldProps: CustomTextFieldProps = {
        extraInputProps: {
            disableUnderline: true,
            readOnly: true,
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid dir="rtl" container spacing={2} direction="row-reverse">
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                    <Grid container direction="column" alignItems="center" component={Paper}
                          className={classes.gridItem}>
                        <Grid item>
                            <Badge
                                badgeContent={
                                    <InputFileIconButton
                                        onFileChange={onFileChangeHandler}
                                        accept={PROFILE_PICTURE_MIME_TYPES.join(",")}
                                    >
                                        <IconButton edge="end" color="primary" aria-label="upload file"
                                                    component="span">
                                            <PhotoCameraIcon/>
                                        </IconButton>
                                    </InputFileIconButton>
                                }
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                overlap="circle"
                            >
                                <Avatar src={avatar} className={classes.avatar}/>
                            </Badge>
                        </Grid>
                        <Grid item className={classNames(classes.gridItem, classes.centerAlign)}>
                            <Typography variant="h5" className={classes.typography}>{user?.fullName}</Typography>
                            <Typography variant="h6" className={classes.typography}>
                                {user ? userRoleInfo(user) : ""}
                            </Typography>
                        </Grid>
                        {/*<Grid container spacing={2} className={classes.gridItem}>*/}
                        {/*    <Grid item xs={6}>*/}
                        {/*        <Button*/}
                        {/*            variant="contained"*/}
                        {/*            fullWidth*/}
                        {/*            color="secondary"*/}
                        {/*        >*/}
                        {/*            تغییر رمز عبور*/}
                        {/*        </Button>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item xs={6}>*/}
                        {/*        <Button*/}
                        {/*            variant="contained"*/}
                        {/*            fullWidth*/}
                        {/*            color="secondary"*/}
                        {/*        >*/}
                        {/*            ویرایش اطلاعات*/}
                        {/*        </Button>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Paper className={classes.gridItem}>
                        <CustomTextField
                            variant="standard"
                            label="نام"
                            value={user ? user.firstName : ""}
                            {...commonTextFieldProps}
                        />
                        <CustomTextField
                            variant="standard"
                            label="نام خانوادگی"
                            value={user ? user.lastName : ""}
                            {...commonTextFieldProps}
                        />
                        <CustomTextField
                            variant="standard"
                            label="جنسیت"
                            value={user ? genderMapToPersian(user.personalInfo.gender) : ""}
                            {...commonTextFieldProps}
                        />
                        <CustomTextField
                            variant="standard"
                            textDir="ltr"
                            label="شماره تلفن"
                            value={user ? UserService.getPhoneNumberRepresentation(user.personalInfo.telephoneNumber) : ""}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">98+</InputAdornment>,
                            }}
                            {...commonTextFieldProps}
                        />
                        <CustomTextField
                            variant="standard"
                            textDir="ltr"
                            label="آدرس ایمیل"
                            value={user ? user.personalInfo.email : ""}
                            {...commonTextFieldProps}
                        />
                        <CustomTextField
                            variant="standard"
                            textDir="ltr"
                            label="نام کاربری"
                            autoComplete="username"
                            value={user ? user.username : ""}
                            {...commonTextFieldProps}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default ProfileView;