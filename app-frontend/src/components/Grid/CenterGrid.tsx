import {BoxProps} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React from "react";

const CenterGrid: React.FunctionComponent<BoxProps> = (props) => {
    return (
        <Box {...props}>
            <Grid container
                  direction="column"
                  dir="rtl"
                  justify="center"
                  alignItems="center"
            >
                {props.children}
            </Grid>
        </Box>
    );
}

export default CenterGrid;