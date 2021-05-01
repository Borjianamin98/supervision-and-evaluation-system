import {
    BoxProps,
    CircularProgress,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Zoom
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from 'react';
import {rtlTheme} from "../../App";
import FullRowCell from "../../components/Table/FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "../../components/Table/OptionalTableCell";
import CustomTablePagination from "../../components/Table/Pagination/CustomTablePagination";
import {LoadingState} from "../../model/enum/loading-state";

const useStyles = makeStyles((theme) => ({
    action: {
        margin: theme.spacing(0, 0.5),
    },
    actionContainer: {
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    tableContainer: {
        overflowX: "hidden",
    },
    circularProgress: {
        margin: theme.spacing(2),
    },
}));

interface StatelessPaginationListProps<T> extends BoxProps {
    total: number,

    page: number,
    onPageChange: (page: number) => void,

    rowsPerPage: number,
    onRowsPerPageChange: (rowsPerPage: number) => void,
    rowsPerPageOptions: number[],

    loadingState: LoadingState,
    collectionData: T[],
    tableHeaderCells: OptionalTableCellProps[],
    tableRow: (row: T, actions: JSX.Element) => React.ReactElement,
    noDataMessage: string,

    onDeleteRow: (row: T) => void,
    isDeletable: (row: T) => boolean,

    onEditRow: (row: T) => void,
}

function StatelessPaginationList<T>(props: StatelessPaginationListProps<T>) {
    const classes = useStyles();
    const {
        total,

        page,
        onPageChange,

        rowsPerPage,
        onRowsPerPageChange,
        rowsPerPageOptions,

        loadingState,
        collectionData,
        tableHeaderCells,
        tableRow,
        noDataMessage,

        onDeleteRow,
        isDeletable,

        onEditRow,
        ...rest
    } = props;

    const tableGeneratedRows = collectionData.map(value => {
        const actions = <div className={classes.actionContainer}>
            <Tooltip TransitionComponent={Zoom} title="ویرایش">
                <IconButton
                    color="secondary"
                    className={classes.action}
                    onClick={() => onEditRow(value)}
                >
                    <EditIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip TransitionComponent={Zoom} title="حذف">
                    <span>
                        <IconButton
                            color="secondary"
                            disabled={!isDeletable(value)}
                            className={classes.action}
                            onClick={() => onDeleteRow(value)}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </span>
            </Tooltip>
        </div>
        return tableRow(value, actions);
    });

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
                if (collectionData.length === 0) {
                    return <FullRowCell headersCount={tableHeaderCells.length}>{noDataMessage}</FullRowCell>;
                } else {
                    return tableGeneratedRows;
                }
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
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={(value) => onPageChange(value)}
                            onChangeRowsPerPage={(value) => onRowsPerPageChange(value)}
                        />
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}

export default StatelessPaginationList;