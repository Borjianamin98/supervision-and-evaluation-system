import {TableRow} from "@material-ui/core";
import React from "react";
import OptionalTableCell, {OptionalTableCellProps} from "./OptionalTableCell";

interface CollapsibleTableRowProps {
    cells: Array<OptionalTableCellProps>,
}

const ExtendedTableRow: React.FunctionComponent<CollapsibleTableRowProps> = (props) => {
    const {cells} = props;

    return (
        <TableRow>
            {cells.map((cell, index) => {
                return <OptionalTableCell
                    key={cell.key ?? index}
                    align="right"
                    component={index === 0 ? "th" : undefined}
                    scope={index === 0 ? "row" : undefined}
                    {...cell}
                />
            })}
        </TableRow>
    );
}

export default ExtendedTableRow;