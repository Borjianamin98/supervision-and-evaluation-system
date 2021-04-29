import {Box, Collapse, TableCell, TableRow} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React from "react";
import ExtendedTableRow from "./ExtendedTableRow";
import {OptionalTableCellProps} from "./OptionalTableCell";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
}));

interface CollapsibleTableRowProps {
    cells: Array<OptionalTableCellProps>,
}

const CollapsibleTableRow: React.FunctionComponent<CollapsibleTableRowProps> = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {cells} = props;

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <ExtendedTableRow cells={cells}/>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={cells.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {props.children}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default CollapsibleTableRow;