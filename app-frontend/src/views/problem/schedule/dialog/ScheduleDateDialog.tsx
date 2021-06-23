import Box from '@material-ui/core/Box';
import {ThemeProvider} from "@material-ui/core/styles";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {AxiosError} from "axios";
import moment from 'moment';
import {useSnackbar} from "notistack";
import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import {rtlTheme} from '../../../../App';
import CustomAlert from "../../../../components/Alert/CustomAlert";
import CustomDatePicker from "../../../../components/DatePicker/CustomDatePicker";
import ConfirmDialog from "../../../../components/Dialog/ConfirmDialog";
import CustomTypography from "../../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../../config/axios-config";
import {Problem} from "../../../../model/problem/problem";
import {DateRange} from "../../../../model/schedule/event/DateRange";
import ScheduleService from "../../../../services/api/schedule/ScheduleService";
import DateUtils from "../../../../utility/DateUtils";

interface ScheduleDateDialogProps {
    problem: Problem,
    open: boolean,
    onDialogClose: () => void,
}

const ScheduleDateDialog: React.FunctionComponent<ScheduleDateDialogProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem, open, onDialogClose} = props;

    const [scheduleMinDate, setScheduleMinDate] = React.useState(moment(problem.meetSchedule.minimumDate));
    const [scheduleMaxDate, setScheduleMaxDate] = React.useState(moment(problem.meetSchedule.maximumDate));
    const [scheduleMinDateError, setScheduleMinDateError] = React.useState(false);
    const [scheduleMaxDateError, setScheduleMaxDateError] = React.useState(false);
    const queryClient = useQueryClient();
    const updateMeetScheduleDate = useMutation(
        (data: { meetScheduleId: number, dateRange: DateRange }) =>
            ScheduleService.updateMeetScheduleDate(data.meetScheduleId, data.dateRange),
        {
            onSuccess: async (data, variables) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
                queryClient.invalidateQueries(["meetScheduleEvents", variables.meetScheduleId])
                queryClient.invalidateQueries(["problemEvents", problem.id]);
                onDialogClose();
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    return (
        <ThemeProvider theme={rtlTheme}>
            <ConfirmDialog
                open={open}
                onAction={confirmed => {
                    if (!confirmed) {
                        onDialogClose();
                        return;
                    }
                    if (scheduleMinDateError || scheduleMaxDateError) {
                        return;
                    }
                    updateMeetScheduleDate.mutate({
                        meetScheduleId: problem.meetSchedule.id,
                        dateRange: {
                            startDate: scheduleMinDate.toDate(),
                            endDate: scheduleMaxDate.toDate(),
                        }
                    })
                }}
                title={"تغییر بازه زمان‌بندی"}
                description={"بازه‌ی زمانی جدید را برای زمان جلسه دفاع مشخص نمایید."}
            >
                <Box display={"flex"} flexDirection={"column"}>
                    <CustomDatePicker
                        label={"زمان شروع"}
                        selectedDate={scheduleMinDate}
                        onDateChange={newValue => setScheduleMinDate(DateUtils.firstOfDay(newValue))}
                        autoSelect={true}
                        minDate={DateUtils.getCurrentDate()}
                        maxDate={scheduleMaxDate}
                        onError={reason => setScheduleMinDateError(Boolean(reason))}
                    />
                    <CustomDatePicker
                        label={"زمان پایان"}
                        selectedDate={scheduleMaxDate}
                        onDateChange={newValue => setScheduleMaxDate(DateUtils.endOfDay(newValue))}
                        autoSelect={true}
                        minDate={scheduleMinDate}
                        maxDate={DateUtils.getCurrentDate(+30)}
                        onError={reason => setScheduleMaxDateError(Boolean(reason))}
                    />
                    <Box marginY={1}>
                        <CustomAlert
                            icon={<InfoOutlinedIcon/>}
                            severity="info"
                        >
                            <CustomTypography lineHeight={2}>
                                زمان‌بندی دفاع مربوط به پایان‌نامه (پروژه) شروع شده است و افراد ذینفع مختلف زمان‌هایی را
                                مشخص نموده‌اند.
                                با تغییر این زمان، زمان‌بندی‌هایی که در خارج از بازه‌ی انتخابی قرار می‌گیرند در نظر
                                گرفته نخواهند شد.
                                پیش از تغییر زمان مربوطه، از هماهنگی‌های لازم با تمامی افراد ذینفع اطمینان حاصل کنید.
                                با تغییر این زمان‌بندی، اطلاعیه‌ای برای تمامی افراد ذینفع ارسال می‌شود تا نسبت به موضوع
                                اطلاع پیدا کنند.
                            </CustomTypography>
                        </CustomAlert>
                    </Box>
                </Box>
            </ConfirmDialog>
        </ThemeProvider>
    )
}

export default ScheduleDateDialog;
