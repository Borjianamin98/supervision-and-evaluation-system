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
import React, {useState} from 'react';
import {rtlTheme} from "../../../App";
import CustomAlert from "../../../components/Alert/CustomAlert";
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import ExtendedTableRow from "../../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../../components/Table/StatelessPaginationTable";
import CustomTextField, {CustomTextFieldProps} from "../../../components/Text/CustomTextField";
import {getGeneralErrorMessage} from "../../../config/axios-config";
import {LoadingState} from "../../../model/enum/loadingState";
import {emptyPageable, Pageable} from "../../../model/pageable";
import {Faculty} from "../../../model/university/faculty";
import {University} from "../../../model/university/university";
import FacultyService from "../../../services/api/university/faculty/FacultyService";
import UniversityService from "../../../services/api/university/UniversityService";

const useStyles = makeStyles((theme) => ({
    noWrap: {
        wrap: "nowrap",
    },
    createGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

const FacultyListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [selectedUniversity, setSelectedUniversity] = useState<University>(UniversityService.createInitialUniversity());
    const [faculties, setFaculties] = React.useState<Pageable<Faculty>>(emptyPageable());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [noDataMessage, setNoDataMessage] = React.useState("دانشکده‌ای تعریف نشده است.");

    // Faculty used to create a new one
    const [newFaculty, setNewFaculty] = React.useState<Faculty>(FacultyService.createInitialFaculty());
    // Faculty used to be in dialog and modified
    const [modifyFaculty, setModifyFaculty] = React.useState<Faculty>(FacultyService.createInitialFaculty());

    const [errorChecking, setErrorChecking] = React.useState(false);
    const [loadingState, setLoadingState] = React.useState<LoadingState>(LoadingState.LOADING);

    React.useEffect(() => {
        if (loadingState === LoadingState.LOADED) {
            return; // Nothing to load
        }

        if (!selectedUniversity.id) {
            setNoDataMessage("دانشگاهی انتخاب نشده است.");
            setLoadingState(LoadingState.LOADED)
            return;
        }
        setNoDataMessage("دانشکده‌ای تعریف نشده است.");

        FacultyService.retrieveUniversityFaculties(selectedUniversity.id, rowsPerPage, page)
            .then(value => {
                setFaculties(value.data);
                setLoadingState(LoadingState.LOADED);
            })
            .catch(error => setLoadingState(LoadingState.FAILED));
    }, [enqueueSnackbar, loadingState, page, rowsPerPage, selectedUniversity.id]);

    const handleFailedRequest = (error: AxiosError) => {
        const {statusCode, message} = getGeneralErrorMessage(error);
        if (statusCode) {
            enqueueSnackbar(`در ارسال درخواست از سرور خطای ${statusCode} دریافت شد.`,
                {variant: "error"});
        } else if (!statusCode) {
            enqueueSnackbar(message, {variant: "error"});
        }
    }

    const handleSuccessRegister = (faculty: Faculty) => {
        enqueueSnackbar(`دانشکده ${faculty.name} با موفقیت اضافه شد.`, {variant: "success"});
        setErrorChecking(false);
        setNewFaculty(FacultyService.createInitialFaculty());
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const registerHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (!FacultyService.isFacultyValid(newFaculty)) {
            setErrorChecking(true);
            return;
        }
        FacultyService.registerFaculty(selectedUniversity.id!, newFaculty)
            .then(value => handleSuccessRegister(value.data))
            .catch(error => handleFailedRequest(error))
    }

    const handleSuccessDelete = (faculty: Faculty) => {
        enqueueSnackbar(`دانشکده ${faculty.name} با موفقیت حذف شد.`, {variant: "success"});
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const deleteHandler = (faculty: Faculty) => {
        FacultyService.deleteFaculty(faculty.id!)
            .then(value => handleSuccessDelete(value.data))
            .catch(error => handleFailedRequest(error))
    }

    const handleSuccessUpdate = (faculty: Faculty) => {
        enqueueSnackbar(`دانشکده ${faculty.name} با موفقیت ویرایش شد.`, {variant: "success"});
        setLoadingState(LoadingState.SHOULD_RELOAD);
    }

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = (faculty: Faculty) => {
        const foundUniversities = faculties.content.filter(value => value.id === faculty.id!);
        if (foundUniversities.length === 0 || foundUniversities.length > 1) {
            throw new Error(`Unexpected error because university IDs should be unique: ID = ${faculty.id!}`);
        }
        setModifyFaculty(foundUniversities[0]);
        setDialogOpen(true);
    };
    const handleDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            FacultyService.updateFaculty(modifyFaculty.id!, modifyFaculty)
                .then(value => handleSuccessUpdate(value.data))
                .catch(error => handleFailedRequest(error))
        }
        setDialogOpen(false);
    };

    function retrieveUniversities(inputValue: string) {
        return UniversityService.retrieveUniversities(100, 0, inputValue)
            .then(value => value.data.content)
    }

    const isBlank = (c: string) => errorChecking && c.length === 0;
    const FacultyNameTextFieldProps: CustomTextFieldProps = {
        required: true,
        label: "نام دانشکده",
        maxLength: 40,
    }
    const FacultyLocationTextFieldProps: CustomTextFieldProps = {
        label: "آدرس اینترنتی",
        textDir: "ltr",
        maxLength: 40,
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <Grid container dir="rtl"
                      component={Paper}
                      elevation={4}
                      className={classes.createGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات دانشکده
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <AsynchronousComboBox
                            disableListWrap
                            getOptionSelected={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => option.name}
                            renderOption={(option) => <Typography noWrap>{option.name}</Typography>}
                            extraClasses={VirtualizedListBoxStyles()}
                            ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                            loadingFunction={inputValue => retrieveUniversities(inputValue)}
                            textFieldInputProps={{
                                label: "دانشگاه",
                                helperText: (isBlank(selectedUniversity.name) ? "دانشگاه مربوطه باید انتخاب شود." : ""),
                                error: isBlank(selectedUniversity.name),
                            }}
                            value={selectedUniversity}
                            onChange={(e, newValue) => {
                                setSelectedUniversity(newValue);
                                setNewFaculty(FacultyService.createInitialFaculty());
                                setLoadingState(LoadingState.SHOULD_RELOAD);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <CustomAlert severity="info">
                            در صورت وجود تعداد زیادی نتیجه، تنها بخشی از آن نمایش داده می‌شود. برای یافتن سریع‌تر،
                            جستجوی خود را دقیق‌تر نمایید.
                        </CustomAlert>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem}>
                        <CustomTextField
                            {...FacultyNameTextFieldProps}
                            value={newFaculty.name}
                            onChange={(e) =>
                                setNewFaculty({...newFaculty, name: e.target.value})}
                            helperText={isBlank(newFaculty.name) ? "نام دانشگاه باید مشخص شود." : ""}
                            error={isBlank(newFaculty.name)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem}>
                        <CustomTextField
                            {...FacultyLocationTextFieldProps}
                            value={newFaculty.webAddress}
                            onChange={(e) =>
                                setNewFaculty({...newFaculty, webAddress: e.target.value})}
                        />
                    </Grid>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <Button
                                onClick={registerHandler}
                                variant="contained"
                                color="primary"
                            >
                                افزودن دانشکده
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <StatelessPaginationTable
                    total={faculties.totalElements}
                    page={page}
                    onPageChange={newPage => {
                        setPage(newPage);
                        setLoadingState(LoadingState.SHOULD_RELOAD);
                    }}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                        setLoadingState(LoadingState.SHOULD_RELOAD);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={loadingState}
                    collectionData={faculties.content}
                    tableHeaderCells={[
                        {content: "نام", width: "60%"},
                        {content: "آدرس اینترنتی", smOptional: true, width: "25%"},
                        {content: "تعداد دانشجوها", xsOptional: true, width: "5%"},
                        {content: "تعداد اساتید", xsOptional: true, width: "5%"},
                        {content: "", width: "5%"}
                    ]}
                    tableRow={(row: Faculty, actions) => {
                        const cells: OptionalTableCellProps[] = [
                            {content: row.name},
                            {content: row.webAddress, smOptional: true, dir: "ltr"},
                            {content: row.studentsCount!, xsOptional: true},
                            {content: row.mastersCount!, xsOptional: true},
                            {content: actions},
                        ];
                        return <ExtendedTableRow key={row.id!} cells={cells}/>;
                    }}
                    noDataMessage={noDataMessage}
                    hasDelete={row => true}
                    onDeleteRow={deleteHandler}
                    isDeletable={row => row.mastersCount! === 0 && row.studentsCount! === 0}
                    hasEdit={row => true}
                    isEditable={row => true}
                    onEditRow={handleDialogOpen}
                    onRetryClick={() => setLoadingState(LoadingState.LOADING)}
                />
                <Dialog dir="rtl" open={dialogOpen} onClose={() => handleDialogClose(false)}>
                    <DialogTitle>ویرایش دانشگاه</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{textAlign: "justify"}}>
                            ویژگی‌ها و اطلاعات مربوط به یک دانشگاه را در بخش زیر ویرایش نموده و پس از بررسی نهایی، تایید
                            کنید.
                        </DialogContentText>
                        <CustomTextField
                            {...FacultyNameTextFieldProps}
                            value={modifyFaculty.name}
                            onChange={(e) =>
                                setModifyFaculty({...modifyFaculty, name: e.target.value})}
                            helperText={isBlank(modifyFaculty.name) ? "نام دانشگاه باید مشخص شود." : ""}
                            error={isBlank(modifyFaculty.name)}
                        />
                        <CustomTextField
                            {...FacultyLocationTextFieldProps}
                            value={modifyFaculty.webAddress}
                            onChange={(e) =>
                                setModifyFaculty({...modifyFaculty, webAddress: e.target.value})}
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

export default FacultyListView;