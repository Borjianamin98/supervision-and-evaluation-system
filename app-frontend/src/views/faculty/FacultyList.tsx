import {BoxProps, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import React from 'react';
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import CustomTablePagination from "../../components/Table/Pagination/CustomTablePagination";
import {Faculty} from "../../model/university/faculty";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
}));

interface FacultyListProps extends BoxProps {
    loaded: boolean,
    faculties: Faculty[],
}

const FacultyList: React.FunctionComponent<FacultyListProps> = (props) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {loaded, faculties, ...rest} = props;

    const tableHeaderCells: OptionalTableCellProps[] = [
        {content: "نام", width: "50%"},
        {content: "مکان", smOptional: true, width: "45%"},
        {content: "", width: "5%"}
    ]

    const tableRows = faculties
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(faculty => {
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
                {content: faculty.name},
                {content: faculty.location, xsOptional: true},
                {content: editButton}
            ];

            return (
                <ExtendedTableRow key={faculty.id!} cells={cells}/>
            );
        });

    const facultyRows = faculties.length === 0 ? (
        <FullRowCell headersCount={tableHeaderCells.length}>دانشکده‌ای تعریف نشده است.</FullRowCell>
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
                                loaded ? facultyRows :
                                    (
                                        <FullRowCell headersCount={tableHeaderCells.length}>
                                            <CircularProgress className={classes.circularProgress}/>
                                        </FullRowCell>
                                    )
                            }
                        </TableBody>
                        <CustomTablePagination
                            rowsPerPageOptions={[]}
                            colSpan={tableHeaderCells.length}
                            count={faculties.length}
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

export default FacultyList;