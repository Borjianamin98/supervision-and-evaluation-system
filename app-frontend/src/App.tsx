import React from 'react';
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {StylesProvider, jssPreset, ThemeProvider, Theme} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import SignIn from './views/SignIn';

export const rtlTheme =(theme: Theme) => createMuiTheme({...theme, direction: "rtl"});

// Configure JSS
const jss = create({plugins: [...jssPreset().plugins, rtl()]});

// Configure custom font
const vazirFontTheme = createMuiTheme({
    typography: {
        fontFamily: "Vazir",
    }
});

const App: React.FunctionComponent = () => {
    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={vazirFontTheme}>
                <CssBaseline/>
                <SignIn/>
            </ThemeProvider>
        </StylesProvider>
    );
}

export default App;
