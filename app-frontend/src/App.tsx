import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {createStyles, jssPreset, makeStyles, StylesProvider, Theme, ThemeProvider} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import {SnackbarProvider} from "notistack";
import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import {AuthenticationRoute, PrivateRoute} from './components/Route/CustomRoute';
import {configAxios} from "./config/axios-config";
import browserHistory from './config/browserHistory';
import LoginView from './views/auth/LoginView';
import SignUpView from "./views/auth/signup/SignUpView";
import ErrorView from "./views/error/ErrorView";
import MainView from "./views/main/MainView";
import {AUTH_VIEW_PATH, LOGIN_VIEW_PATH, SIGNUP_VIEW_PATH} from "./views/ViewPaths";

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        snackbarRoot: {
            direction: "rtl",
        }
    }),
);

const App: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={vazirFontTheme}>
                <CssBaseline/>
                <SnackbarProvider
                    classes={{
                        root: classes.snackbarRoot
                    }}
                    maxSnack={1}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={5000}
                >
                    <Router history={browserHistory}>
                        <Switch>
                            <AuthenticationRoute path={AUTH_VIEW_PATH}>
                                <Switch>
                                    <AuthenticationRoute path={LOGIN_VIEW_PATH}>
                                        <LoginView/>
                                    </AuthenticationRoute>
                                    <AuthenticationRoute path={SIGNUP_VIEW_PATH}>
                                        <SignUpView/>
                                    </AuthenticationRoute>
                                </Switch>
                            </AuthenticationRoute>
                            <Route exact path="/error">
                                <ErrorView/>
                            </Route>
                            <PrivateRoute>
                                <MainView/>
                            </PrivateRoute>
                        </Switch>
                    </Router>
                </SnackbarProvider>
            </ThemeProvider>
        </StylesProvider>
    );
}

export const rtlTheme = (theme: Theme) => createMuiTheme({...theme, direction: "rtl"});

export default App;
