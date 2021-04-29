import React from "react";
import OptionalTableCell, {OptionalTableCellProps} from "./OptionalTableCell";

interface CollapsibleTableRowProps {
    cells: Array<OptionalTableCellProps>,
}

const ExtendedTableRow: React.FunctionComponent<CollapsibleTableRowProps> = (props) => {
    const {cells} = props;

    return (
        <React.Fragment>
            {cells.map((cell, index) => {
                return <OptionalTableCell
                    key={index}
                    align="right"
                    component={index === 0 ? "th" : undefined}
                    scope={index === 0 ? "row" : undefined}
                    {...cell}
                />
            })}
        </React.Fragment>
    );
}

export default ExtendedTableRow;