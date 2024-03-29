import {BoxProps, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from 'react';
import {rtlTheme} from "../../App";
import {LoadingState} from "../../model/enum/loadingState";
import TooltipIconButton, {TooltipIconButtonProps} from "../Button/TooltipIconButton";
import FullRowCell from "./FullRowCell";
import OptionalTableCell, {OptionalTableCellProps} from "./OptionalTableCell";
import CustomTablePagination from "./Pagination/CustomTablePagination";

const useStyles = makeStyles((theme) => ({
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
    cellInfo: {
        padding: theme.spacing(2, 0),
    }
}));

export interface StatelessPaginationListAction<T> extends Omit<TooltipIconButtonProps, "onClick" | "hidden"> {
    onClickAction: (row: T) => void,
    icon: React.ReactNode,
    hidden?: boolean,
}

interface StatelessPaginationListProps<T> extends BoxProps {
    size?: "small" | "medium",
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
    hasDelete: (row: T) => boolean,

    onEditRow: (row: T) => void,
    isEditable: (row: T) => boolean,
    hasEdit: (row: T) => boolean,

    extraActions?: StatelessPaginationListAction<T>[],

    onRetryClick: () => void,
}

function StatelessPaginationTable<T>(props: StatelessPaginationListProps<T>) {
    const classes = useStyles();
    const {
        size,
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
        hasDelete,

        onEditRow,
        isEditable,
        hasEdit,

        extraActions,

        onRetryClick,

        ...rest
    } = props;

    const tableGeneratedRows = collectionData.map(row => {
        const editAction = <TooltipIconButton
            tooltipTitle="ویرایش"
            color="secondary"
            disabled={!isEditable(row)}
            onClick={() => onEditRow(row)}>
            <EditIcon/>
        </TooltipIconButton>;
        const deleteAction = <TooltipIconButton
            tooltipTitle="حذف"
            color="secondary"
            disabled={!isDeletable(row)}
            onClick={() => onDeleteRow(row)}>
            <DeleteIcon/>
        </TooltipIconButton>
        const customActions = extraActions?.map((actionProps, index) => {
            const {onClickAction, icon, hidden, ...rest} = actionProps;
            return (hidden ?? false) ? null : (
                <TooltipIconButton
                    key={index}
                    color="secondary"
                    onClick={() => onClickAction(row)}
                    {...rest}
                >
                    {icon}
                </TooltipIconButton>
            );
        });

        const actions = (
            <div className={classes.actionContainer}>
                {hasEdit(row) ? editAction : null}
                {hasDelete(row) ? deleteAction : null}
                {customActions}
            </div>
        )
        return tableRow(row, actions);
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
            case LoadingState.FETCHING:
                if (collectionData.length === 0) {
                    return <FullRowCell
                        className={classes.cellInfo}
                        headersCount={tableHeaderCells.length}>
                        {noDataMessage}
                    </FullRowCell>;
                } else {
                    return tableGeneratedRows;
                }
            case LoadingState.FAILED:
                return (
                    <FullRowCell headersCount={tableHeaderCells.length} className={classes.cellInfo}>
                        <Typography paragraph>در دریافت اطلاعات از سرور خطایی رخ داده است.</Typography>
                        <Grid container justify={"center"}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => onRetryClick()}
                            >
                                تلاش دوباره
                            </Button>
                        </Grid>
                    </FullRowCell>
                );
        }
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Box dir="rtl" {...rest}>
                <TableContainer component={Paper} elevation={4} className={classes.tableContainer}>
                    <Table size={size ?? "small"}>
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
                            onPageChange={(value) => onPageChange(value)}
                            onRowsPerPageChange={(value) => onRowsPerPageChange(value)}
                        />
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}

export default StatelessPaginationTable;