import Box, {BoxProps} from '@material-ui/core/Box';
import Typography, {TypographyProps, TypographyTypeMap} from "@material-ui/core/Typography";
import React from 'react';

interface CustomTypographyProps {
    justifyText?: boolean,
    lineHeight?: number,
    boxProps?: BoxProps,
}

function CustomTypography<D extends React.ElementType = TypographyTypeMap['defaultComponent'],
    P = {}>(props: CustomTypographyProps & TypographyProps<D, P>) {
    const {justifyText, lineHeight, boxProps, className, ...rest} = props;

    return (
        <Typography
            align={"justify"}
            component={lineHeight ? "div" : undefined}
            {...rest}
        >
            {lineHeight ? <Box lineHeight={lineHeight} {...boxProps}>{props.children}</Box> : props.children}
        </Typography>
    )
}

export default CustomTypography;