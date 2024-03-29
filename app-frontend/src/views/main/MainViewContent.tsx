import React from 'react';
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../components/Route/CustomRoute";
import {DASHBOARD_VIEW_PATH} from '../ViewPaths';
import {allRoutesInfo} from './MainViewNavBarLinks';

const MainViewContent: React.FunctionComponent = () => {
    return (
        <Switch>
            {allRoutesInfo
                .map((value, id) =>
                    <PrivateRoute key={id} exact={value.exact ?? false} path={value.path} accessRoles={value.roles}>
                        {React.createElement(value.component, {})}
                    </PrivateRoute>
                )}
            <Redirect to={DASHBOARD_VIEW_PATH}/>
        </Switch>
    );
}

export default MainViewContent;