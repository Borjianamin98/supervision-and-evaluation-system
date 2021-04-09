import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {jssPreset, StylesProvider, Theme, ThemeProvider} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import React from 'react';
import {Router, Switch} from 'react-router-dom';
import {AuthenticationRoute, PrivateRoute} from './components/Route/CustomRoute';
import {configAxios} from "./config/axios-config";
import browserHistory from './config/browserHistory';
import MainView from "./views/MainView";
import SignInView from './views/SignInView';

// Configuration
// Configure axios library globally
configAxios();
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
                <Router history={browserHistory}>
                    <Switch>
                        <AuthenticationRoute path="/login">
                            <SignInView/>
                        </AuthenticationRoute>
                        <PrivateRoute>
                            <MainView/>
                        </PrivateRoute>
                    </Switch>
                </Router>
            </ThemeProvider>
        </StylesProvider>
    );
}

export const rtlTheme = (theme: Theme) => createMuiTheme({...theme, direction: "rtl"});

export default App;
