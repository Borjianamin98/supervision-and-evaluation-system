import {TableRow, TableRowProps} from "@material-ui/core";
import React from "react";
import OptionalTableCell, {OptionalTableCellProps} from "./OptionalTableCell";

interface CollapsibleTableRowProps extends TableRowProps {
    cells: Array<OptionalTableCellProps>,
}

const ExtendedTableRow: React.FunctionComponent<CollapsibleTableRowProps> = (props) => {
    const {cells, ...rest} = props;

    return (
        <TableRow {...rest}>
            {cells.map((cell, index) => {
                return <OptionalTableCell
                    key={index}
                    scope={index === 0 ? "row" : undefined}
                    {...cell}
                />
            })}
            {props.children}
        </TableRow>
    );
}

export default ExtendedTableRow;