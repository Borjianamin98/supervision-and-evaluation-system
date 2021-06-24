import {ThemeProvider} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import {rtlTheme} from "../../../App";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {Master} from "../../../model/user/master/Master";
import UserService from "../../../services/api/user/UserService";
import LocaleUtils from "../../../utility/LocaleUtils";

interface MasterInfoListProps {
    master: Master,
}

const MasterInfoList: React.FunctionComponent<MasterInfoListProps> = (props) => {
    const {master} = props;

    return (
        <ThemeProvider theme={rtlTheme}>
            <TitleTypography>نام</TitleTypography>
            <Typography paragraph>{master.firstName}</Typography>

            <TitleTypography>نام خانوادگی</TitleTypography>
            <CustomTypography paragraph>{master.lastName}</CustomTypography>

            <TitleTypography>ایمیل</TitleTypography>
            <CustomTypography paragraph>{master.personalInfo.email}</CustomTypography>

            <TitleTypography>شماره تلفن</TitleTypography>
            <CustomTypography
                align={"left"}
                paragraph
                style={{direction: "ltr"}}
            >
                {LocaleUtils.convertToPersianDigits("+98 " +
                    UserService.getPhoneNumberRepresentation(master.personalInfo.telephoneNumber))}
            </CustomTypography>

            <TitleTypography>دانشگاه</TitleTypography>
            <CustomTypography paragraph>{master.university.name}</CustomTypography>

            <TitleTypography>دانشکده</TitleTypography>
            <CustomTypography paragraph>{master.faculty.name}</CustomTypography>

            <TitleTypography>مدرک</TitleTypography>
            <CustomTypography paragraph>{master.degree}</CustomTypography>
        </ThemeProvider>
    );
}

const TitleTypography: React.FunctionComponent = (props) => {
    return (
        <CustomTypography
            variant={"body1"}
            color={"textSecondary"}
            gutterBottom>
            {props.children}
        </CustomTypography>
    );
}

export default MasterInfoList;