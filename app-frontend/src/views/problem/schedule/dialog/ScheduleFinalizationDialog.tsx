import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import {ThemeProvider} from "@material-ui/core/styles";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import moment from 'moment';
import React from 'react';
import {rtlTheme} from '../../../../App';
import CustomAlert from "../../../../components/Alert/CustomAlert";
import CustomDatePicker from "../../../../components/DatePicker/CustomDatePicker";
import CustomTimePicker from "../../../../components/DatePicker/CustomTimePicker";
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {Problem} from "../../../../model/problem/problem";
import DateUtils from "../../../../utility/DateUtils";

interface ScheduleDateDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const PersonListItem: React.FunctionComponent<{ name: string, secondary: string }> = (props) => {
    const {name, secondary} = props;
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar/>
            </ListItemAvatar>
            <ListItemText
                primary={name}
                secondary={secondary}
            />
        </ListItem>
    )
}

const ScheduleFinalizationDialog: React.FunctionComponent<ScheduleDateDialogProps> = (props) => {
    const {problem, open, onClose} = props;

    const [selectedDate, setSelectedDate] = React.useState(DateUtils.getCurrentDate());

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                title={"تایین زمان دفاع"}
                description={`زمان دفاع پایان‌نامه (پروژه) «${problem.title}»`}
                open={open}
                onClose={reason => {
                    if (reason === "closed") {
                        onClose();
                        return;
                    }
                    // Do something
                }}
                actions={[
                    {content: "انصراف", name: "closed"},
                    {content: "زمان‌بندی دوباره", name: "reschedule"},
                    {content: "تایید زمان دفاع", name: "confirm"},
                ]}
            >
                <Box display={"flex"} flexDirection={"column"}>
                    <CustomTypography lineHeight={2}>
                        زمان‌بندی دفاع مربوط به پایان‌نامه (پروژه) شروع شده است و افراد ذینفع زیر تاکنون زمان‌های خود را
                        نهایی کرده‌اند:
                    </CustomTypography>
                    <List>
                        <PersonListItem name={"صادق علی‌اکبری"} secondary={"صادق علی‌اکبری"}/>
                        <PersonListItem name={"صادق علی‌اکبری"} secondary={"صادق علی‌اکبری"}/>
                    </List>
                    <CustomTypography lineHeight={2}>
                        در صورتی که تمامی افراد زمان‌بندی خود را نهایی نکرده‌اند، بهتر است صبر کنید تا همه افراد تایید
                        کنند.
                        بعد از وارد شدن زمان‌بندی تمام افراد، می‌توانید زمان برگزاری جلسه دفاع را در ادامه مشخص نمایید.
                    </CustomTypography>
                    <CustomDatePicker
                        label={"تاریخ دفاع"}
                        selectedDate={selectedDate}
                        onDateChange={newValue => setSelectedDate(DateUtils.firstOfDay(newValue))}
                        autoSelect={true}
                        minDate={DateUtils.firstOfDay(DateUtils.getCurrentDate())}
                        maxDate={DateUtils.endOfDay(problem.meetSchedule.maximumDate)}
                    />
                    <CustomTimePicker
                        label={"زمان شروع دفاع"}
                        selectedDate={selectedDate}
                        onDateChange={newValue => setSelectedDate(prev =>
                            moment(prev).set({
                                hour: newValue.hour(),
                                minute: newValue.minute(),
                                second: newValue.second(),
                                millisecond: newValue.millisecond(),
                            }))}
                        autoSelect={false}
                    />
                    <CustomAlert
                        icon={<InfoOutlinedIcon/>}
                        severity="info"
                    >
                        <CustomTypography lineHeight={2}>
                            در صورتی که زمان مشخصی را به عنوان زمان مشترک تشکیل جلسه‌ی دفاع پیدا نمی‌کنید، می‌توانید
                            درخواست زمان‌بندی دوباره را از تمامی افراد ذینفع در جلسه داشته باشید.
                            در این صورت پیامی برای تمامی افراد ذینفع مبنی بر زمان‌بندی دوباره ارسال می‌شود و شما
                            می‌توانید از همه بخواهید تا سعی کنند زمان‌های حضور خود را بهتر نمایند تا زمانی مشترک برای
                            تشکیل جلسه‌ی دفاع یافت شود.
                        </CustomTypography>
                    </CustomAlert>
                </Box>
            </MultiActionDialog>
        </ThemeProvider>
    )
}

export default ScheduleFinalizationDialog;
