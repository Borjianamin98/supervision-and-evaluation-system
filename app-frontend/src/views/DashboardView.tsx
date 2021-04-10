import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import apiAxios from "../config/axios-config";
import {User} from "../model/user";
import {API_USER_PATH} from "../services/ApiPaths";

interface UserApiResponse {
    users: Array<User>,
}

const DashboardView: React.FunctionComponent = () => {
    const location = useLocation();

    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        apiAxios.get<UserApiResponse>(API_USER_PATH)
            .then(value => setUsers(value.data.users))
            .catch(err => console.log("error"));
    }, [location.key])

    return (
        <div dir="rtl">
            <Typography paragraph>
                نام کاربران که به صورت امتحانی صرفا دریافت شده و نمایش داده شده است:
            </Typography>
            <List>
                {
                    users.map(u => <ListItem dir="rtl" key={u.username}>
                        <ListItemText primary={u.username}/>
                    </ListItem>)
                }
            </List>
        </div>
    );
}

export default DashboardView;