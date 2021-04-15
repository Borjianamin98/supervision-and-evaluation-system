import {makeStyles} from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    tabPanel: {
        padding: theme.spacing(2, 0)
    }
}));

interface TabPanelProps {
    index: number;
    value: number;
}

const TabPanel: React.FunctionComponent<TabPanelProps> = (props) => {
    const classes = useStyles();
    const {value, index, ...rest} = props;

    return (
        <div
            hidden={value !== index}
            className={classes.tabPanel}
            {...rest}
        >
            {props.children}
        </div>
    );
}

export default TabPanel;