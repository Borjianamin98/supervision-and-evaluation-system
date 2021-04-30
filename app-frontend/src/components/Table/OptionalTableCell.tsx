import {Hidden, TableCell, TableCellProps} from "@material-ui/core";
import React from "react";

export interface OptionalTableCellProps extends TableCellProps {
    key?: number,
    content: React.ReactNode,
    optional?: boolean,
}

const OptionalTableCell: React.FunctionComponent<OptionalTableCellProps> = (props) => {
    const {content, optional, ...rest} = props;

    function InternalTableCell() {
        return <TableCell
            {...rest}
        >
            {content}
        </TableCell>
    }

    return optional ? (
        <Hidden smDown>
            <InternalTableCell/>
        </Hidden>
    ) : (
        <InternalTableCell/>
    );
}

export default OptionalTableCell;