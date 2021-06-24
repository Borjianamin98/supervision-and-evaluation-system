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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import StatelessPaginationTable from "../../components/Table/StatelessPaginationTable";
import CustomTextField, {CustomTextFieldProps} from "../../components/Text/CustomTextField";
import {generalErrorHandler} from "../../config/axios-config";
import {toLoadingState} from "../../model/enum/loadingState";
import {University} from "../../model/university/University";
import {UniversitySave} from "../../model/university/UniversitySave";
import UniversityService from "../../services/api/university/UniversityService";

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

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [errorChecking, setErrorChecking] = React.useState(false);

    // University used to create a new one
    const [newUniversity, setNewUniversity] = React.useState(UniversityService.createInitialUniversitySave());
    // University used to be in dialog and modified
    const [modifyUniversityId, setModifyUniversityId] = React.useState<number>();
    const [modifyUniversity, setModifyUniversity] = React.useState(UniversityService.createInitialUniversitySave());

    const queryClient = useQueryClient();
    const {data: universities, ...universitiesQuery} = useQuery(['universities', rowsPerPage, page],
        () => UniversityService.retrieveUniversities(rowsPerPage, page), {
            keepPreviousData: true
        });
    const registerUniversity = useMutation(
        (universitySave: UniversitySave) => UniversityService.registerUniversity(universitySave),
        {
            onSuccess: data => queryClient.invalidateQueries(['universities', rowsPerPage, page]).then(() => {
                enqueueSnackbar(`دانشگاه ${data.name} با موفقیت اضافه شد.`, {variant: "success"});
                setErrorChecking(false);
                setNewUniversity(UniversityService.createInitialUniversitySave());
            }),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const updateUniversity = useMutation(
        (data: Parameters<typeof UniversityService.updateUniversity>) => UniversityService.updateUniversity(...data),
        {
            onSuccess: data => queryClient.invalidateQueries(['universities', rowsPerPage, page])
                .then(() => enqueueSnackbar(`دانشگاه ${data.name} با موفقیت ویرایش شد.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const deleteUniversity = useMutation(
        (universityId: number) => UniversityService.deleteUniversity(universityId),
        {
            onSuccess: data => queryClient.invalidateQueries(['universities'])
                .then(() => enqueueSnackbar(`دانشگاه ${data.name} با موفقیت حذف شد.`, {variant: "success"})),
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    const registerHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (!UniversityService.isUniversityValid(newUniversity)) {
            setErrorChecking(true);
            return;
        }
        registerUniversity.mutate(newUniversity);
    }

    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const handleUpdateDialogOpen = (university: University) => {
        setModifyUniversityId(university.id);
        setModifyUniversity(university);
        setUpdateDialogOpen(true);
    };
    const handleUpdateDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            updateUniversity.mutate([modifyUniversityId!, modifyUniversity]);
        }
        setUpdateDialogOpen(false);
    };

    const isBlank = (c: string) => errorChecking && c.length === 0;
    const UniversityNameTextFieldProps: CustomTextFieldProps = {
        required: true,
        label: "نام دانشگاه",
        maxLength: 40,
    }
    const UniversityLocationTextFieldProps: CustomTextFieldProps = {
        label: "آدرس",
        maxLength: 40,
    }
    const UniversityAddressTextFieldProps: CustomTextFieldProps = {
        label: "آدرس اینترنتی",
        textDir: "ltr",
        maxLength: 60,
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
                            اطلاعات دانشگاه
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <CustomTextField
                            {...UniversityNameTextFieldProps}
                            value={newUniversity.name}
                            onChange={(e) =>
                                setNewUniversity({...newUniversity, name: e.target.value})}
                            helperText={isBlank(newUniversity.name) ? "نام دانشگاه باید مشخص شود." : ""}
                            error={isBlank(newUniversity.name)}
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
                <StatelessPaginationTable
                    total={universities ? universities.totalElements : 0}
                    page={page}
                    onPageChange={newPage => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={newRowsPerPage => {
                        setRowsPerPage(newRowsPerPage);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10]}
                    loadingState={toLoadingState(universitiesQuery)}
                    collectionData={universities ? universities.content : []}
                    tableHeaderCells={[
                        {content: "نام", width: "60%"},
                        {content: "آدرس", xsOptional: true, width: "15%"},
                        {content: "آدرس اینترنتی", smOptional: true, width: "10%"},
                        {content: "تعداد دانشکده", width: "10%"},
                        {content: "", width: "5%"}
                    ]}
                    tableRow={(row: University, actions) => {
                        const cells: OptionalTableCellProps[] = [
                            {content: row.name},
                            {content: row.location, smOptional: true},
                            {content: row.webAddress, xsOptional: true, dir: "ltr"},
                            {content: row.facultiesCount},
                            {content: actions},
                        ];
                        return <ExtendedTableRow key={row.id} cells={cells}/>;
                    }}
                    noDataMessage="دانشگاهی تعریف نشده است."
                    hasDelete={row => true}
                    isDeletable={row => row.facultiesCount! === 0}
                    onDeleteRow={row => deleteUniversity.mutate(row.id!)}
                    hasEdit={row => true}
                    isEditable={row => true}
                    onEditRow={handleUpdateDialogOpen}
                    onRetryClick={() => queryClient.invalidateQueries(["universities", rowsPerPage, page])}
                />
                <Dialog dir="rtl" open={updateDialogOpen} onClose={() => handleUpdateDialogClose(false)}>
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
                            helperText={isBlank(modifyUniversity.name) ? "نام دانشگاه باید مشخص شود." : ""}
                            error={isBlank(modifyUniversity.name)}
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
                        <Button onClick={() => handleUpdateDialogClose(false)} color="primary">
                            لغو ویرایش
                        </Button>
                        <Button onClick={() => handleUpdateDialogClose(true)} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </ThemeProvider>
    );
}

export default UniversityListView;