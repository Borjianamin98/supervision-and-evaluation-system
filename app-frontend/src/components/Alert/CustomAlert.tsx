import {makeStyles} from "@material-ui/core/styles";
import {Alert, AlertProps} from "@material-ui/lab";
import classNames from "classnames";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    justify: {
        textAlign: "justify",
    },
    icon: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
}));

const CustomAlert: React.FunctionComponent<AlertProps> = (props) => {
    const classes = useStyles();
    const {className, ...rest} = props;

    return (
        <Alert
            className={classNames(classes.justify, className)}
            classes={{
                icon: classes.icon,
            }}
            {...rest}
        >
            {props.children}
        </Alert>
    )
}

export default CustomAlert;