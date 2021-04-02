import React from 'react';
import Button from "@material-ui/core/Button";
import AuthenticationService from '../services/api/AuthenticationService';
import {Link} from "react-router-dom";

const SettingView: React.FunctionComponent = () => {
    return (
        <>
            <p>Page setting</p>
            <Link to="/dashboard">Go dashboard</Link>
            <Button variant="contained" onClick={() => AuthenticationService.logout()}>Log out!</Button>
        </>
    );
}

export default SettingView;