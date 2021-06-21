import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import {ThemeProvider} from "@material-ui/core/styles";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {AxiosError} from 'axios';
import moment from 'moment';
import {useSnackbar} from 'notistack';
import React from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {rtlTheme} from '../../../../App';
import CustomAlert from "../../../../components/Alert/CustomAlert";
import CustomDatePicker from "../../../../components/DatePicker/CustomDatePicker";
import CustomTimePicker from "../../../../components/DatePicker/CustomTimePicker";
import MultiActionDialog from "../../../../components/Dialog/MultiActionDialog";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../../config/axios-config";
import browserHistory from "../../../../config/browserHistory";
import {ApiError} from "../../../../model/api/ApiError";
import {Problem} from "../../../../model/problem/problem";
import {userRoleInfo} from "../../../../model/user/User";
import ScheduleService from "../../../../services/api/schedule/ScheduleService";
import DateUtils from "../../../../utility/DateUtils";
import {PROBLEM_MANAGEMENT_VIEW_PATH} from "../../../ViewPaths";

function minAvailableHour(selectedDate: moment.Moment) {
    let minAvailableHour = 8;
    if (!selectedDate.isAfter(DateUtils.endOfDay(DateUtils.getCurrentDate()))) {
        // Selected finalize date is in today date time
        minAvailableHour = Math.max(new Date().getHours(), 8);
    }
    return minAvailableHour;
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

interface ScheduleDateDialogProps {
    problem: Problem,
    open: boolean,
    onClose: () => void,
}

const ScheduleFinalizationDialog: React.FunctionComponent<ScheduleDateDialogProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem, open, onClose} = props;

    const queryClient = useQueryClient();
    const rescheduleMeetSchedule = useMutation((data: number) =>
            ScheduleService.requestRescheduleMeetSchedule(data),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
                queryClient.invalidateQueries(["problemEvents", problem.id]);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });
    const finalizeMeetSchedule = useMutation(
        (data: { meetScheduleId: number, finalizedDate: Date }) =>
            ScheduleService.finalizeMeetSchedule(data.meetScheduleId, data.finalizedDate),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
                queryClient.invalidateQueries(["problemEvents", problem.id]);
                browserHistory.push(`${PROBLEM_MANAGEMENT_VIEW_PATH}/${problem.id}`);
            },
            onError: (error: AxiosError<ApiError>) => {
                if (error.response && error.response.status === 409) {
                    enqueueSnackbar(error.response.data.faMessage, {variant: "error"});
                } else {
                    generalErrorHandler(error, enqueueSnackbar);
                }
            },
        });

    const [selectedDate, setSelectedDate] = React.useState(DateUtils.getCurrentDate().hours(12));
    const announcedUsers = [problem.student, problem.supervisor, ...problem.referees]
        .filter(user => problem.meetSchedule.announcedUsers.includes(user.id));

    const [selectedDateError, setSelectedDateError] = React.useState(false);
    React.useEffect(() => {
        // Calculated based on 'scheduleStartHour' and 'scheduleEndHour' of scheduler.
        const maxAvailableTime = 20 * 60 - problem.meetSchedule.durationMinutes;
        const selectedDayTimeOfDay = DateUtils.minutesPassedSinceStartOfDay(selectedDate);
        setSelectedDateError(selectedDayTimeOfDay < minAvailableHour(selectedDate) * 60
            || selectedDayTimeOfDay > maxAvailableTime);
    }, [problem.meetSchedule.durationMinutes, selectedDate]);

    return (
        <ThemeProvider theme={rtlTheme}>
            <MultiActionDialog
                title={"تایین زمان دفاع"}
                description={`دفاع پایان‌نامه (پروژه) «${problem.title}»`}
                open={open}
                onClose={reason => {
                    if (reason === "closed") {
                        onClose();
                        return;
                    }

                    if (selectedDateError) {
                        return;
                    }
                    switch (reason) {
                        case "reschedule":
                            rescheduleMeetSchedule.mutate(problem.meetSchedule.id, {
                                onSuccess: () => onClose()
                            });
                            break;
                        case "confirm":
                            finalizeMeetSchedule.mutate({
                                meetScheduleId: problem.meetSchedule.id,
                                finalizedDate: selectedDate.toDate(),
                            });
                            break;
                        default:
                            throw new Error("Unexpected reason for dialog actions");
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
                    {
                        announcedUsers.length > 0 ? (
                            <>
                                <CustomTypography lineHeight={2}>
                                    افراد زیر تاکنون زمان‌های خود را نهایی کرده‌اند:
                                </CustomTypography>
                                <List>
                                    {announcedUsers.map(announcedUser => (
                                        <PersonListItem
                                            key={announcedUser.id}
                                            name={announcedUser.fullName}
                                            secondary={userRoleInfo(announcedUser)}
                                        />
                                    ))}
                                </List>
                            </>
                        ) : (
                            <CustomTypography lineHeight={2}>
                                هیچ کدام از افراد حاضر در جلسه‌ی دفاع تاکنون زمان‌بندی خود را نهایی نکرده‌اند.
                            </CustomTypography>
                        )
                    }
                    <CustomTypography lineHeight={2}>
                        در صورتی که تمامی افراد زمان‌بندی خود را نهایی نکرده‌اند، بهتر است صبر کنید تا همه افراد
                        زمان‌بندی خود را مشخص و نهایی کنند.
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
                        textFieldProps={{
                            error: selectedDateError,
                            helperText: `ساعت جلسه دفاع باید بین ${minAvailableHour(selectedDate)} الی 20 باشد.`,
                        }}
                    />
                    <CustomAlert
                        icon={<InfoOutlinedIcon/>}
                        severity="info"
                    >
                        <CustomTypography lineHeight={2}>
                            در صورتی که زمان مشخصی را به عنوان زمان مشترک تشکیل جلسه‌ی دفاع پیدا نمی‌کنید، می‌توانید
                            درخواست زمان‌بندی دوباره را انتخاب کنید تا پیامی برای تمامی افراد مبنی بر زمان‌بندی دوباره
                            ارسال می‌شود.
                            شما می‌توانید از همه بخواهید تا سعی کنند زمان‌های حضور خود را بهتر نمایند تا زمانی مشترک
                            برای تشکیل جلسه‌ی دفاع یافت شود.
                        </CustomTypography>
                    </CustomAlert>
                </Box>
            </MultiActionDialog>
        </ThemeProvider>
    )
}

export default ScheduleFinalizationDialog;
