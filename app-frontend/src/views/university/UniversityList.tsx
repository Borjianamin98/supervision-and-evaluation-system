import {BoxProps, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import {useSnackbar} from "notistack";
import React from 'react';
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import CustomTablePagination from "../../components/Table/Pagination/CustomTablePagination";
import {getGeneralErrorMessage} from "../../config/axios-config";
import {Faculty} from "../../model/university/faculty";
import {University} from "../../model/university/university";
import UniversityService from "../../services/api/university/UniversityService";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
}));

interface UniversityListProps extends BoxProps {
    loaded: boolean,
    universities: University[],
    rowsPerPageOptions: number[],
}

const UniversityList: React.FunctionComponent<UniversityListProps> = (props) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {loaded, universities, rowsPerPageOptions, ...rest} = props;

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
                {content: university.webAddress, xsOptional: true, dir: "ltr"},
                {content: editButton}
            ];

            return (
                <ExtendedTableRow key={university.id!} cells={cells}/>
            );
        });

    const universityRows = universities.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>دانشگاهی تعریف نشده است.</FullRowCell>
    ) : tableRows;

    return (
        <ThemeProvider theme={rtlTheme}>
            <Box dir="rtl" {...rest}>
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
                            rowsPerPageOptions={rowsPerPageOptions}
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
            </Box>
        </ThemeProvider>
    );
}

export default UniversityList;