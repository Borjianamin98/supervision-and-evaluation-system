import React from 'react';
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import {DASHBOARD_VIEW_PATH} from '../ViewPaths';
import {navBarRoutesInfo} from './MainViewNavBarLinks';

const MainViewContent: React.FunctionComponent = () => {
    return (
        <Switch>
            {navBarRoutesInfo.map((value, id) =>
                <PrivateRoute key={id} exact path={value.path}>
                    {React.createElement(value.component, {})}
                </PrivateRoute>
            )}
            <Redirect to={DASHBOARD_VIEW_PATH}/>
        </Switch>
    );
}

export default MainViewContent;