import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import {useRouteMatch} from "react-router-dom";
import ListItemLink from '../../components/List/ListItemLink';

const DashboardNvaBarLinks: React.FunctionComponent = () => {
    const routeMatch = useRouteMatch();

    return (
        <>
            <List>
                <ListItemLink key='home' dir="rtl" to={routeMatch.path} primary="صفحه اصلی" icon={<HomeIcon/>}/>
                <ListItemLink key='setting' dir="rtl" to={`${routeMatch.path}/setting`} primary="تنظیمات"
                              icon={<SettingsIcon/>}/>
            </List>
            <Divider/>
            <List>
                <ListItemLink key='messages' dir="rtl" to={routeMatch.path} primary="پیام‌ها" icon={<InboxIcon/>}/>
                <ListItemLink key='emails' dir="rtl" to={routeMatch.path} primary="ایمیل‌ها" icon={<MailIcon/>}/>
                <ListItemLink key='profile' dir="rtl" to={`${routeMatch.path}/user`} primary="حساب کاربری"
                              icon={<PersonIcon/>}/>
            </List>
        </>
    );
}

export default DashboardNvaBarLinks;