import {DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {AxiosError} from "axios";
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../App";
import CustomTextField, {CustomTextFieldProps} from "../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {LoadingState} from "../../model/enum/loading-state";
import {emptyPageable, Pageable} from "../../model/pageable";
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

    const [universities, setUniversities] = React.useState<Pageable<University>>(emptyPageable());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // University used to create a new one
    const [newUniversity, setNewUniversity] = React.useState<University>(UniversityService.createInitialUniversity());
    // University used to be in dialog and modified
    const [modifyUniversity, setModifyUniversity] = React.useState<University>(UniversityService.createInitialUniversity());

    const [errorChecking, setErrorChecking] = React.useState(false);
    const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.LOADING);

    React.useEffect(() => {
        if (universities.number === page && universities.size === rowsPerPage &&
            loadingState === LoadingState.LOADED) {
            return;
        }

        UniversityService.retrieveUniversities(rowsPerPage, page)
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
    }, [enqueueSnackbar, page, rowsPerPage, universities.number, universities.size, loadingState]);

    const handleFailedRequest = (error: AxiosError) => {
        const {statusCode, message} = getGeneralErrorMessage(error);
        if (statusCode) {
            enqueueSnackbar(`در ارسال درخواست از سرور خطای ${statusCode} دریافت شد.`,
                {variant: "error"});
        } else if (!statusCode) {
            enqueueSnackbar(message, {variant: "error"});
        }
    }

    const handleSuccessRegister = (university: University) => {
        enqueueSnackbar(`دانشگاه ${university.name} با موفقیت اضافه شد.`, {variant: "success"});
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
            .then(value => handleSuccessRegister(value.data))
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

    const handleSuccessUpdate = (university: University) => {
        enqueueSnackbar(`دانشگاه ${university.name} با موفقیت ویرایش شد.`, {variant: "success"});
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = (universityId: number) => {
        const foundUniversities = universities.content.filter(university => university.id === universityId);
        if (foundUniversities.length === 0 || foundUniversities.length > 1) {
            throw new Error(`Unexpected error because university IDs should be unique: ID = ${universityId}`);
        }
        setModifyUniversity(foundUniversities[0]);
        setDialogOpen(true);
    };

    const handleDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            UniversityService.updateUniversity(modifyUniversity.id!, modifyUniversity)
                .then(value => handleSuccessUpdate(value.data))
                .catch(error => handleFailedRequest(error))
        }
        setDialogOpen(false);
    };

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;
    const UniversityNameTextFieldProps: CustomTextFieldProps = {
        required: true,
        label: "نام دانشگاه",
        maxLength: 40,
    }
    const UniversityLocationTextFieldProps: CustomTextFieldProps = {
        label: "مکان",
        maxLength: 40,
    }
    const UniversityAddressTextFieldProps: CustomTextFieldProps = {
        label: "آدرس اینترنتی",
        textDir: "ltr",
        maxLength: 100,
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <UniversityList
                    loadingState={loadingState}
                    total={universities.totalElements}
                    pageStateHook={[page, setPage]}
                    rowsPerPageStateHook={[rowsPerPage, setRowsPerPage]}
                    universities={universities.content}
                    rowsPerPageOptions={[5, 10]}
                    onDeleteRow={deleteHandler}
                    onEditRow={handleDialogOpen}
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
                        <CustomTextField
                            {...UniversityNameTextFieldProps}
                            value={newUniversity.name}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, name: e.target.value})}
                            helperText={isNotBlank(newUniversity.name) ? "" : "نام دانشگاه باید مشخص شود."}
                            error={!isNotBlank(newUniversity.name)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <CustomTextField
                            {...UniversityLocationTextFieldProps}
                            value={newUniversity.location}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, location: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.gridItem}>
                        <CustomTextField
                            {...UniversityAddressTextFieldProps}
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
                <Dialog dir="rtl" open={dialogOpen} onClose={() => handleDialogClose(false)}>
                    <DialogTitle>ویرایش دانشگاه</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{textAlign: "justify"}}>
                            ویژگی‌ها و اطلاعات مربوط به یک دانشگاه را در بخش زیر ویرایش نموده و پس از بررسی نهایی، تایید
                            کنید.
                        </DialogContentText>
                        <CustomTextField
                            {...UniversityNameTextFieldProps}
                            value={modifyUniversity.name}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, name: e.target.value})}
                            helperText={isNotBlank(modifyUniversity.name) ? "" : "نام دانشگاه باید مشخص شود."}
                            error={!isNotBlank(modifyUniversity.name)}
                        />
                        <CustomTextField
                            {...UniversityLocationTextFieldProps}
                            value={modifyUniversity.location}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, location: e.target.value})}
                        />
                        <CustomTextField
                            {...UniversityAddressTextFieldProps}
                            value={modifyUniversity.webAddress}
                            onChange={(e) =>
                                setModifyUniversity({...modifyUniversity, webAddress: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDialogClose(false)} color="primary">
                            لغو ویرایش
                        </Button>
                        <Button onClick={() => handleDialogClose(true)} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </ThemeProvider>
    );
}

export default UniversityListView;