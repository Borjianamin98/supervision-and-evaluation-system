import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from "../../App";

const MasterReportView: React.FunctionComponent = () => {

    return (
        <ThemeProvider theme={rtlTheme}>

        </ThemeProvider>
    );
}

export default MasterReportView;