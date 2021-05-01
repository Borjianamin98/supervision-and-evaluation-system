import {ThemeProvider} from "@material-ui/core/styles";
import React from 'react';
import {rtlTheme} from "../../App";

const FacultyListView: React.FunctionComponent = () => {

    return (
        <ThemeProvider theme={rtlTheme}>
            <div>صفحه‌ی دانشکده‌ها</div>
        </ThemeProvider>
    );
}

export default FacultyListView;