import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {createStyles, jssPreset, makeStyles, StylesProvider, Theme, ThemeProvider} from '@material-ui/core/styles';
import {create} from 'jss';
import rtl from 'jss-rtl';
import {SnackbarProvider} from "notistack";
import React from 'react';
import {QueryClient, QueryClientProvider} from "react-query";
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
        fontFamily: "Vazir !important",
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

    // React-Query client configurations
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            }
        }
    });

    const rootRouting = (
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
    )

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
                    <QueryClientProvider client={queryClient}>
                        <>
                            {rootRouting}
                            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
                        </>
                    </QueryClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </StylesProvider>
    );
}

export const rtlTheme = (theme: Theme) => createMuiTheme({...theme, direction: "rtl"});
export const ltrTheme = (theme: Theme) => createMuiTheme({...theme, direction: "ltr"});

export default App;
