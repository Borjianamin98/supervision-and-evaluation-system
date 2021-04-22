import {Box, Collapse, TableCell, TableRow} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
}));

interface Cell {
    content: React.ReactNode,
    isOptional?: boolean,
}

interface CollapsibleTableRowProps {
    cells: Array<Cell>,
}

const CollapsibleTableRow: React.FunctionComponent<CollapsibleTableRowProps> = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {cells} = props;

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                {cells.map((cell, index) => {
                    return <TableCell
                        key={index}
                        align="right"
                        component={index === 0 ? "th" : undefined}
                        scope={index === 0 ? "row" : undefined}
                    >
                        {cell.content}
                    </TableCell>
                })}
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