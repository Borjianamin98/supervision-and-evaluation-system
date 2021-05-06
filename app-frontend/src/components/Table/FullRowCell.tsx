import {TableCell, TableCellProps, TableRow} from "@material-ui/core";
import React from "react";

interface FullRowCellProps extends Omit<TableCellProps, "colSpan" | "align"> {
    headersCount: number,
}

const FullRowCell: React.FunctionComponent<FullRowCellProps> = (props) => {
    const {headersCount, ...rest} = props;

    return (
        <TableRow>
            <TableCell align="center" colSpan={headersCount + 1} {...rest}>{props.children}</TableCell>
        </TableRow>
    );
}

export default FullRowCell;