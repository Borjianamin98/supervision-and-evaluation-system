import React from 'react';
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {StylesProvider, jssPreset, ThemeProvider, Theme} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import SignInView from './views/SignInView';
import {Redirect, Router, Switch} from 'react-router-dom';
import {PrivateRoute, AuthenticationRoute} from './components/Route/CustomRoute';
import browserHistory from './config/browserHistory';
import {configAxios} from "./config/axios-config";
import DashboardView from "./views/DashboardView";

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
                        <PrivateRoute path="/dashboard">
                            <DashboardView/>
                        </PrivateRoute>
                        <Redirect to="/dashboard"/>
                    </Switch>
                </Router>
            </ThemeProvider>
        </StylesProvider>
    );
}

export const rtlTheme = (theme: Theme) => createMuiTheme({...theme, direction: "rtl"});

export default App;
