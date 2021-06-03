import {BoxProps} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";

const CenterBox: React.FunctionComponent<BoxProps> = (props) => {
    return (
        <Box dir="rtl"
             display="flex"
             flexDirection="column"
             justifyContent="center"
             alignItems="center"
             {...props}>
            {props.children}
        </Box>
    );
}

export default CenterBox;