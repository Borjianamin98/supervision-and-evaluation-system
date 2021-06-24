import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from "../../../App";
import {Master} from "../../../model/user/master/Master";

interface MasterReportViewProps {
    master: Master,
}

const MasterReportView: React.FunctionComponent<MasterReportViewProps> = (props) => {
    const {master} = props;

    return (
        <ThemeProvider theme={rtlTheme}>

        </ThemeProvider>
    );
}

export default MasterReportView;