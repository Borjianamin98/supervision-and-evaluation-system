import {TablePaginationProps, TableRow} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import {TablePaginationBaseProps} from "@material-ui/core/TablePagination/TablePagination";
import {TablePaginationActionsProps} from "@material-ui/core/TablePagination/TablePaginationActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from 'react';
import LocaleUtils from "../../../utility/LocaleUtils";
import CustomTablePaginationActions from "./CustomTablePaginationActions";

const useStyles = makeStyles((theme) => ({
    paginationInput: {
        margin: theme.spacing(0, 1),
    }
}));

type CustomTablePaginationProps<D extends React.ElementType = React.ComponentType<TablePaginationBaseProps>,
    P = {}> =
    Omit<TablePaginationProps<D, P>, "onPageChange" | "onRowsPerPageChange" | "count" | "rowsPerPageOptions">
    & {
    rowsPerPageOptions: number[],
    count: number,
    onRowsPerPageChange: (newValue: number) => void,
    onPageChange: (newValue: number) => void,
}

const CustomTablePagination: React.FunctionComponent<CustomTablePaginationProps> = (props) => {
    const classes = useStyles();
    const mobileMatches = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const {rowsPerPageOptions, count, ...rest} = props;

    const handleChangePage: TablePaginationActionsProps["onPageChange"] = (event, newPage) => {
        props.onPageChange(newPage);
    };
    const handleChangeRowsPerPage: TablePaginationProps["onRowsPerPageChange"] = (event) => {
        props.onRowsPerPageChange(parseInt(event.target.value, 10));
    };

    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    {...rest}
                    rowsPerPageOptions={mobileMatches ? [] : rowsPerPageOptions}
                    count={count}
                    classes={{
                        input: classes.paginationInput,
                    }}
                    labelRowsPerPage="تعداد:"
                    labelDisplayedRows={paginationInfo =>
                        LocaleUtils.convertToPersianDigits(`سطرهای ${paginationInfo.from} تا ${paginationInfo.to} از ${paginationInfo.count}`)}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={CustomTablePaginationActions}
                />
            </TableRow>
        </TableFooter>
    );
}

export default CustomTablePagination;