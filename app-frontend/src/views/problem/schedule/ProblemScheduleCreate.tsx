import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {ThemeProvider} from "@material-ui/core/styles";
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {AxiosError} from 'axios';
import {useSnackbar} from 'notistack';
import React from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {rtlTheme} from '../../../App';
import CustomAlert from "../../../components/Alert/CustomAlert";
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomDatePicker from "../../../components/DatePicker/CustomDatePicker";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {generalErrorHandler} from "../../../config/axios-config";
import {Problem} from "../../../model/problem/problem";
import {MeetScheduleSave} from "../../../model/schedule/MeetScheduleSave";
import {
    PERSIAN_SCHEDULE_DURATIONS,
    ScheduleDuration,
    scheduleDurationMapToEnglish,
    scheduleDurationMapToPersian
} from "../../../model/schedule/ScheduleDuration";
import ScheduleService from "../../../services/api/schedule/ScheduleService";
import DateUtils from "../../../utility/DateUtils";

interface ProblemScheduleCreateProps {
    commonClasses: ClassNameMap,
    problem: Problem,
}

const ProblemScheduleCreate: React.FunctionComponent<ProblemScheduleCreateProps> = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {problem, commonClasses} = props;

    const [initialScheduleDuration, setInitialScheduleDuration] = React.useState(ScheduleDuration.THIRTY_MINUTES);
    const [scheduleMinDate, setScheduleMinDate] = React.useState(DateUtils.firstOfDay(DateUtils.getCurrentDate()));
    const [scheduleMaxDate, setScheduleMaxDate] = React.useState(DateUtils.endOfDay(DateUtils.getCurrentDate()));

    const queryClient = useQueryClient();
    const startMeetSchedule = useMutation(
        (data: { meetScheduleId: number, meetScheduleSave: MeetScheduleSave }) =>
            ScheduleService.startMeetSchedule(data.meetScheduleId, data.meetScheduleSave),
        {
            onSuccess: async (data) => {
                queryClient.setQueryData<Problem>(["problem", problem.id], {...problem, meetSchedule: data});
                await queryClient.invalidateQueries(['events', problem.id]);
            },
            onError: (error: AxiosError) => generalErrorHandler(error, enqueueSnackbar),
        });

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <Grid
                    container dir="rtl"
                    component={Paper}
                    elevation={4}
                    className={commonClasses.topGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={commonClasses.gridItem}>
                        <Typography variant="h6" gutterBottom>
                            اطلاعات زمان‌بندی
                        </Typography>
                        <CustomTypography lineHeight={2}>
                            برای جمع‌بندی و تحویل‌گرفتن نهایی پایان‌نامه (پروژه) دانشجو، نیاز به تشکیل جلسه‌ی دفاع و
                            ارائه‌ی دانشجو می‌باشد.
                            به این منظور لازم است که جلسه‌ای برای دفاع دانشجو از پایان‌نامه (پروژه) مشخص شود که در
                            آن تمامی اساتید داور، راهنما و دانشجو حضور داشته باشند.
                            پیدا کردن زمانی مشترک که همه‌ی افراد در آن حضور داشته باشند لازمه‌ی اصلی تشکیل جلسه
                            می‌باشد.
                            در این قسمت شما پس از مشخص‌کردن مواردی از جمله مدت زمان جلسه و محدوده‌ی زمانی مجاز
                            برای برگزاری آن، زمان‌های حضور خود را وارد می‌نمایید.
                            در ادامه شما و دیگر اساتید و دانشجو باید بر اساس موارد مشخص‌کرده، زمان‌های حضور خود را
                            اعلام نمایید.
                            با شروع زمان‌بندی اطلاعیه‌ای برای تمامی افراد ذینفع در فرایند زمان‌بندی ارسال می‌شود تا نسبت
                            به شروع فرآیند زمان‌بندی مطلع شوند.
                        </CustomTypography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={commonClasses.gridItem}>
                        <ComboBox
                            options={PERSIAN_SCHEDULE_DURATIONS}
                            filterOptions={(options) => options} // do not filter values
                            value={scheduleDurationMapToPersian(initialScheduleDuration)}
                            onChange={(e, newValue) => setInitialScheduleDuration(scheduleDurationMapToEnglish(newValue))}
                            textFieldInputProps={{
                                label: "مدت زمان",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={commonClasses.gridItem}>
                        <CustomDatePicker
                            label={"زمان شروع"}
                            selectedDate={scheduleMinDate}
                            onDateChange={newValue => setScheduleMinDate(DateUtils.firstOfDay(newValue))}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate()}
                            maxDate={scheduleMaxDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={commonClasses.gridItem}>
                        <CustomDatePicker
                            label={"زمان پایان"}
                            selectedDate={scheduleMaxDate}
                            onDateChange={newValue => setScheduleMaxDate(DateUtils.endOfDay(newValue))}
                            autoSelect={true}
                            minDate={scheduleMinDate}
                            maxDate={DateUtils.getCurrentDate(+30)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={commonClasses.gridItem}>
                        <CustomAlert
                            icon={<InfoOutlinedIcon/>}
                            severity="info"
                            variant="outlined"
                        >
                            <CustomTypography lineHeight={2}>
                                دقت شود که با شروع زمان‌بندی دفاع، امکان تغییر تنها زمان شروع و پایان دفاع امکان‌پذیر
                                می‌باشد.
                            </CustomTypography>
                        </CustomAlert>
                    </Grid>
                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} className={commonClasses.gridItem}
                          justify={"center"}>
                        <Box marginTop={1}>
                            <Button
                                onClick={() => {
                                    startMeetSchedule.mutate({
                                        meetScheduleId: problem.meetSchedule.id,
                                        meetScheduleSave: {
                                            durationMinutes: initialScheduleDuration,
                                            minimumDate: scheduleMinDate.toDate(),
                                            maximumDate: scheduleMaxDate.toDate(),
                                        }
                                    })
                                }}
                                variant="contained"
                                color="primary"
                            >
                                شروع زمان‌بندی
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default ProblemScheduleCreate;