import React from 'react';
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import {navBarRoutesInfo} from './MainViewNavBarLinks';

const MainViewContent: React.FunctionComponent = () => {
    return (
        <Switch>
            {navBarRoutesInfo.map((value, id) =>
                <PrivateRoute key={id} exact path={value.path}>
                    {React.createElement(value.component, {})}
                </PrivateRoute>
            )}
            <Redirect to="/dashboard"/>
        </Switch>
    );
}

export default MainViewContent;