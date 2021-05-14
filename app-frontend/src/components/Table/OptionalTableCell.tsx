import {Hidden, TableCell, TableCellProps} from "@material-ui/core";
import React from "react";

export interface OptionalTableCellProps extends TableCellProps {
    content: React.ReactNode,
    mdOptional?: boolean,
    smOptional?: boolean,
    xsOptional?: boolean,
}

const OptionalTableCell: React.FunctionComponent<OptionalTableCellProps> = (props) => {
    const {content, mdOptional, smOptional, xsOptional, ...rest} = props;

    function InternalTableCell() {
        return <TableCell
            {...rest}
        >
            {content}
        </TableCell>
    }

    return (
        <Hidden smDown={smOptional} xsDown={xsOptional} mdDown={mdOptional}>
            <InternalTableCell/>
        </Hidden>
    )
}

export default OptionalTableCell;