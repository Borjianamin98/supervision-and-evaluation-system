import Box from '@material-ui/core/Box';
import {makeStyles} from "@material-ui/core/styles";
import Typography, {TypographyProps, TypographyTypeMap} from "@material-ui/core/Typography";
import classNames from "classnames";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    justify: {
        textAlign: "justify",
    },
}));

interface CustomTypographyProps {
    justifyText?: boolean,
    lineHeight?: number,
}

function CustomTypography<D extends React.ElementType = TypographyTypeMap['defaultComponent'],
    P = {}>(props: CustomTypographyProps & TypographyProps<D, P>) {
    const classes = useStyles();
    const {justifyText, lineHeight, className, ...rest} = props;

    return (
        <Typography
            className={classNames({
                [classes.justify]: justifyText ?? true,
            }, className)}
            component={lineHeight ? "div" : undefined}
            {...rest}
        >
            {lineHeight ? <Box lineHeight={lineHeight}>{props.children}</Box> : props.children}
        </Typography>
    )
}

export default CustomTypography;