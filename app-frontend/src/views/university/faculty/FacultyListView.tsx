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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../../App";
import CustomAlert from "../../../components/Alert/CustomAlert";
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import ExtendedTableRow from "../../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../../components/Table/StatelessPaginationTable";
import CustomTextField, {CustomTextFieldProps} from "../../../components/Text/CustomTextField";
import {generalErrorHandler} from "../../../config/axios-config";
import {toLoadingState} from "../../../model/enum/loadingState";
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

    const [selectedUniversity, setSelectedUniversity] = useState<University>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [noDataMessage, setNoDataMessage] = React.useState("دانشکده‌ای تعریف نشده است.");
    const [errorChecking, setErrorChecking] = React.useState(false);

    // Faculty used to create a new one
    const [newFaculty, setNewFaculty] = React.useState<Faculty>(FacultyService.createInitialFaculty());
    // Faculty used to be in dialog and modified
    const [modifyFaculty, setModifyFaculty] = React.useState<Faculty>(FacultyService.createInitialFaculty());

    const queryClient = useQueryClient();
    const {data: faculties, ...facultiesQuery} = useQuery(['faculties', selectedUniversity, rowsPerPage, page],
        () => {
            if (!selectedUniversity) {
                setNoDataMessage("دانشگاهی انتخاب نشده است.");
                return;
            }
            setNoDataMessage("دانشکده‌ای تعریف نشده است.");
            return FacultyService.retrieveUniversityFaculties(selectedUniversity.id!, rowsPerPage, page);
        }, {
            keepPreviousData: true
        });

    const registerFaculty = useMutation(
        (data: Parameters<typeof FacultyService.registerFaculty>) => FacultyService.registerFaculty(data[0], data[1]),
        {
            onSuccess: data => queryClient.invalidateQueries(['faculties', selectedUniversity, rowsPerPage, page]).then(() => {
                enqueueSnackbar(`دانشکده ${data.name} با موفقیت اضافه شد.`, {variant: "success"});
                setErrorChecking(false);
                setNewFaculty(FacultyService.createInitialFaculty());
            }),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const updateFaculty = useMutation(
        (data: Parameters<typeof FacultyService.updateFaculty>) => FacultyService.updateFaculty(...data),
        {
            onSuccess: data => queryClient.invalidateQueries(['faculties', selectedUniversity, rowsPerPage, page])
                .then(() => enqueueSnackbar(`دانشکده ${data.name} با موفقیت ویرایش شد.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const deleteFaculty = useMutation(
        (facultyId: number) => FacultyService.deleteFaculty(facultyId),
        {
            onSuccess: data => queryClient.invalidateQueries(['faculties', selectedUniversity])
                .then(() => enqueueSnackbar(`دانشکده ${data.name} با موفقیت حذف شد.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const registerHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (!selectedUniversity || !FacultyService.isFacultyValid(newFaculty)) {
            setErrorChecking(true);
            return;
        }
        registerFaculty.mutate([selectedUniversity.id!, newFaculty]);
    }

    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const handleUpdateDialogOpen = (faculty: Faculty) => {
        setModifyFaculty(faculty);
        setUpdateDialogOpen(true);
    };
    const handleDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            updateFaculty.mutate([modifyFaculty.id!, modifyFaculty]);
        }
        setUpdateDialogOpen(false);
    };

    function retrieveUniversities(inputValue: string) {
        return UniversityService.retrieveUniversities(100, 0, inputValue)
            .then(value => value.content)
    }

    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);
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
                                helperText: (isBlank(selectedUniversity?.name) ? "دانشگاه مربوطه باید انتخاب شود." : ""),
                                error: isBlank(selectedUniversity?.name),
                            }}
                            value={selectedUniversity}
                            onChange={(e, newValue) => {
                                setSelectedUniversity(newValue);
                                setNewFaculty(FacultyService.createInitialFaculty());
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
                    total={faculties ? faculties.totalElements : 0}
                    page={page}
                    onPageChange={newPage => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={toLoadingState(facultiesQuery)}
                    collectionData={faculties ? faculties.content : []}
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
                    onDeleteRow={row => deleteFaculty.mutate(row.id!)}
                    isDeletable={row => row.mastersCount! === 0 && row.studentsCount! === 0}
                    hasEdit={row => true}
                    isEditable={row => true}
                    onEditRow={handleUpdateDialogOpen}
                    onRetryClick={() => queryClient.invalidateQueries(["faculties", selectedUniversity, rowsPerPage, page])}
                />
                <Dialog dir="rtl" open={updateDialogOpen} onClose={() => handleDialogClose(false)}>
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