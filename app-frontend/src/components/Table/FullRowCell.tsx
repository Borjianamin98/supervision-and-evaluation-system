import {TableCell, TableRow} from "@material-ui/core";
import React from "react";

interface FullRowCellProps {
    headersCount: number,
}

const FullRowCell: React.FunctionComponent<FullRowCellProps> = (props) => {
    return (
        <TableRow>
            <TableCell align="center" colSpan={props.headersCount + 1}>{props.children}</TableCell>
        </TableRow>
    );
}

export default FullRowCell;