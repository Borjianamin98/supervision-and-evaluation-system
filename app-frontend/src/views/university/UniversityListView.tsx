import {DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../App";
import CustomTextField from "../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {LoadingState} from "../../model/enum/loading-state";
import {University} from "../../model/university/university";
import UniversityService from "../../services/api/university/UniversityService";
import UniversityList from "./UniversityList";

const useStyles = makeStyles((theme) => ({
    createGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

const UniversityListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [universities, setUniversities] = React.useState<University[]>([]);
    // University used to create a new one
    const [newUniversity, setNewUniversity] = React.useState<University>(UniversityService.createInitialUniversity());
    // University used to be in dialog and modified
    const [modifyUniversity, setModifyUniversity] = React.useState<University>(UniversityService.createInitialUniversity());

    const [errorChecking, setErrorChecking] = React.useState(false);
    const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.LOADING);

    React.useEffect(() => {
        if (loadingState === LoadingState.LOADED) {
            return;
        }

        UniversityService.retrieveUniversities()
            .then(value => {
                setUniversities(value.data);
                setLoadingState(LoadingState.LOADED);
            })
            .catch(error => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت اطلاعات از سرور خطای ${statusCode} دریافت شد. دوباره تلاش نمایید.`,
                        {variant: "error"});
                } else {
                    enqueueSnackbar(message, {variant: "error"});
                }
                setLoadingState(LoadingState.FAILED);
            });
    }, [enqueueSnackbar, loadingState]);

    const handleFailedRequest = (error: AxiosError) => {
        const {statusCode, message} = getGeneralErrorMessage(error);
        if (statusCode) {
            enqueueSnackbar(`در ارسال درخواست از سرور خطای ${statusCode} دریافت شد.`,
                {variant: "error"});
        } else if (!statusCode) {
            enqueueSnackbar(message, {variant: "error"});
        }
    }

    const handleSuccessRegister = () => {
        enqueueSnackbar("دانشگاه جدید با موفقیت اضافه شد.", {variant: "success"});
        setErrorChecking(false);
        setNewUniversity(UniversityService.createInitialUniversity());
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const registerHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (!UniversityService.isUniversityValid(newUniversity)) {
            setErrorChecking(true);
            return;
        }
        UniversityService.registerUniversity(newUniversity)
            .then(() => handleSuccessRegister())
            .catch(error => handleFailedRequest(error))
    }

    const handleSuccessDelete = (university: University) => {
        enqueueSnackbar(`دانشگاه ${university.name} با موفقیت حذف شد.`, {variant: "success"});
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const deleteHandler = (universityId: number) => {
        UniversityService.deleteUniversity(universityId)
            .then(value => handleSuccessDelete(value.data))
            .catch(error => handleFailedRequest(error))
    }

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = (universityId: number) => {
        const foundUniversities = universities.filter(university => university.id === universityId);
        if (foundUniversities.length === 0 || foundUniversities.length > 1) {
            throw new Error(`Unexpected error because university IDs should be unique: ID = ${universityId}`);
        }
        setModifyUniversity(foundUniversities[0]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;
    const UniversityNameTextField = (props: TextFieldProps) => <CustomTextField
        {...props}
        required
        label="نام دانشگاه"
        maxLength={40}
    />
    const UniversityLocationTextField = (props: TextFieldProps) => <CustomTextField
        {...props}
        label="مکان"
        maxLength={40}
    />
    const UniversityAddressTextField = (props: TextFieldProps) => <CustomTextField
        {...props}
        label="آدرس اینترنتی"
        textDir="ltr"
        maxLength={100}
    />

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <UniversityList
                    loadingState={loadingState}
                    universities={universities}
                    rowsPerPageOptions={[5, 10]}
                    onDeleteRow={deleteHandler}
                    onEditRow={handleClickOpen}
                />
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.createGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات دانشگاه
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <UniversityNameTextField
                            value={newUniversity.name}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, name: e.target.value})}
                            helperText={isNotBlank(newUniversity.name) ? "" : "نام دانشگاه باید مشخص شود."}
                            error={!isNotBlank(newUniversity.name)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <UniversityLocationTextField
                            value={newUniversity.location}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, location: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.gridItem}>
                        <UniversityAddressTextField
                            value={newUniversity.webAddress}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, webAddress: e.target.value})}
                        />
                    </Grid>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <Button
                                onClick={registerHandler}
                                variant="contained"
                                color="primary"
                            >
                                افزودن دانشگاه
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog dir="rtl" open={open} onClose={handleClose}>
                    <DialogTitle>ویرایش دانشگاه</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{textAlign: "justify"}}>
                            ویژگی‌ها و اطلاعات مربوط به یک دانشگاه را در بخش زیر ویرایش نموده و پس از بررسی نهایی، تایید
                            کنید.
                        </DialogContentText>
                        <UniversityNameTextField
                            value={modifyUniversity.name}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, name: e.target.value})}
                            helperText={isNotBlank(modifyUniversity.name) ? "" : "نام دانشگاه باید مشخص شود."}
                            error={!isNotBlank(modifyUniversity.name)}
                        />
                        <UniversityLocationTextField
                            value={modifyUniversity.location}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, location: e.target.value})}
                        />
                        <UniversityAddressTextField
                            value={modifyUniversity.webAddress}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, webAddress: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            لغو ویرایش
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </ThemeProvider>
    );
}

export default UniversityListView;