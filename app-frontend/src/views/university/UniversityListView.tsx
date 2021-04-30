import {CircularProgress, Fab, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from "@material-ui/icons/Edit";
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import CustomTablePagination from "../../components/Table/Pagination/CustomTablePagination";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {University} from "../../model/university/university";
import UniversityService from "../../services/api/university/UniversityService";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    tableContainer: {
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(3),
        left: theme.spacing(3),
    },
}));

const UniversityListView: React.FunctionComponent = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [universities, setUniversities] = React.useState<University[]>([]);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        UniversityService.retrieveUniversities()
            .then(value => {
                setUniversities(value.data);
                setLoaded(true);
            })
            .catch(error => {
                const {message, statusCode} = getGeneralErrorMessage(error);
                if (statusCode) {
                    enqueueSnackbar(`در دریافت اطلاعات از سرور خطای ${statusCode} دریافت شد. دوباره تلاش نمایید.`,
                        {variant: "error"});
                } else {
                    enqueueSnackbar(message, {variant: "error"});
                }
            });
    }, [enqueueSnackbar])

    const tableHeaderCells: OptionalTableCellProps[] = [
        {content: "نام", width: "50%"},
        {content: "مکان", smOptional: true, width: "20%"},
        {content: "آدرس اینترنتی", xsOptional: true, width: "25%"},
        {content: "", width: "5%"}
    ]

    const tableRows = universities
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(university => {
            const editButton = (
                <ThemeProvider theme={rtlTheme}>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<EditIcon/>}
                    >
                        ویرایش
                    </Button>
                </ThemeProvider>
            )
            const cells: OptionalTableCellProps[] = [
                {content: university.name},
                {content: university.location, smOptional: true},
                {content: university.webAddress, xsOptional: true, align: "left"},
                {content: editButton}
            ];

            return (
                <ExtendedTableRow key={university.id!} cells={cells}/>
            );
        });

    const universityRows = universities.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>مسئله‌ای یافت نشد.</FullRowCell>
    ) : tableRows;

    return (
        <ThemeProvider theme={rtlTheme}>
            <>
                <div dir="rtl" className={classes.root}>
                    <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {tableHeaderCells.map((cell, index) => (
                                        <OptionalTableCell component="th" key={index} {...cell}/>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    loaded ? universityRows :
                                        (
                                            <FullRowCell headersCount={tableHeaderCells.length}>
                                                <CircularProgress className={classes.circularProgress}/>
                                            </FullRowCell>
                                        )
                                }
                            </TableBody>
                            <CustomTablePagination
                                colSpan={tableHeaderCells.length}
                                count={universities.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={newValue => setPage(newValue)}
                                onChangeRowsPerPage={newValue => {
                                    setRowsPerPage(newValue);
                                    setPage(0);
                                }}
                            />
                        </Table>
                    </TableContainer>
                </div>
                <Fab color="secondary" aria-label="add" className={classes.fab}>
                    <AddIcon/>
                </Fab>
            </>
        </ThemeProvider>
    );
}

export default UniversityListView;