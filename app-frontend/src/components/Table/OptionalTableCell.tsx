import {Hidden, TableCell, TableCellProps} from "@material-ui/core";
import React from "react";

export interface OptionalTableCellProps extends TableCellProps {
    content: React.ReactNode,
    smOptional?: boolean,
    xsOptional?: boolean,
}

const OptionalTableCell: React.FunctionComponent<OptionalTableCellProps> = (props) => {
    const {content, smOptional, xsOptional, ...rest} = props;

    function InternalTableCell() {
        return <TableCell
            {...rest}
        >
            {content}
        </TableCell>
    }

    return (
        <Hidden smDown={smOptional} xsDown={xsOptional}>
            <InternalTableCell/>
        </Hidden>
    )
}

export default OptionalTableCell;