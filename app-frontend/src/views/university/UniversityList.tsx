import {BoxProps, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import React from 'react';
import {rtlTheme} from "../../App";
import ExtendedTableRow from "../../components/Table/ExtendedTableRow";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import CustomTablePagination from "../../components/Table/Pagination/CustomTablePagination";
import {LoadingState} from "../../model/enum/loading-state";
import {University} from "../../model/university/university";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
}));

interface UniversityListProps extends BoxProps {
    loadingState: LoadingState,
    universities: University[],
    rowsPerPageOptions: number[],
}

const UniversityList: React.FunctionComponent<UniversityListProps> = (props) => {
    const classes = useStyles();
    const {loadingState, universities, rowsPerPageOptions, ...rest} = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions.length > 0 ? rowsPerPageOptions[0] : 5);

    React.useEffect(() => {
        if (loadingState !== LoadingState.SHOULD_RELOAD) {
            setPage(0);
        }
    }, [loadingState]);

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

    const tableBodyContent = (state: LoadingState) => {
        switch (state) {
            case LoadingState.LOADING:
                return (
                    <FullRowCell headersCount={tableHeaderCells.length}>
                        <CircularProgress className={classes.circularProgress}/>
                    </FullRowCell>
                )
            case LoadingState.LOADED:
            case LoadingState.SHOULD_RELOAD:
                return universityRows;
            case LoadingState.FAILED:
                return (
                    <FullRowCell headersCount={tableHeaderCells.length}>
                        <Typography>در دریافت اطلاعات از سرور خطایی رخ داده است.</Typography>
                    </FullRowCell>
                );
        }
    }

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
                        <TableBody>{tableBodyContent(loadingState)}</TableBody>
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