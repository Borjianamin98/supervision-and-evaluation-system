import HistoryIcon from "@material-ui/icons/History";
import {AlertProps} from "@material-ui/lab";
import React from 'react';
import CustomAlert from "./CustomAlert";

const HistoryInfoAlert: React.FunctionComponent<Omit<AlertProps, "icon" | "severity" | "variant">> = props => {
    return (
        <CustomAlert
            icon={<HistoryIcon/>}
            severity="info"
            variant="outlined"
            {...props}
        >
            {props.children}
        </CustomAlert>
    )
}

export default HistoryInfoAlert;