import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import moment from 'moment';
import React from 'react';
import {rtlTheme} from '../../../App';
import CustomAlert from "../../../components/Alert/CustomAlert";
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomDatePicker from "../../../components/DatePicker/CustomDatePicker";
import CustomTypography from "../../../components/Typography/CustomTypography";
import {Problem} from "../../../model/problem/problem";
import {
    PERSIAN_SCHEDULE_DURATIONS,
    ScheduleDuration,
    scheduleDurationMapToEnglish,
    scheduleDurationMapToPersian
} from "../../../model/schedule/ScheduleDuration";
import DateUtils from "../../../utility/DateUtils";
import {SaveMeetScheduleMutation} from "./ProblemScheduleView";

const useStyles = makeStyles((theme) => ({
    topGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

interface ProblemScheduleCreateProps {
    problem: Problem,
    saveMeetScheduleMutation: SaveMeetScheduleMutation,
}

const ProblemScheduleCreate: React.FunctionComponent<ProblemScheduleCreateProps> = (props) => {
    const classes = useStyles();
    const {saveMeetScheduleMutation} = props;

    const [initialScheduleDuration, setInitialScheduleDuration] = React.useState(ScheduleDuration.THIRTY_MINUTES);
    const [scheduleMinDate, setScheduleMinDate] = React.useState(moment(DateUtils.getCurrentDate()));
    const [scheduleMaxDate, setScheduleMaxDate] = React.useState(moment(DateUtils.getCurrentDate()));

    return (
        <ThemeProvider theme={rtlTheme}>
            <Grid container direction="column">
                <Grid
                    container dir="rtl"
                    component={Paper}
                    elevation={4}
                    className={classes.topGrid}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
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
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
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
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان شروع"}
                            selectedDate={scheduleMinDate}
                            onDateChange={newValue =>
                                setScheduleMinDate(newValue.set({hour: 0, minute: 0, second: 0, millisecond: 0}))}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+30)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4} className={classes.gridItem}>
                        <CustomDatePicker
                            label={"زمان پایان"}
                            selectedDate={scheduleMaxDate}
                            onDateChange={newValue =>
                                setScheduleMaxDate(newValue.set({hour: 23, minute: 59, second: 59, millisecond: 999}))}
                            autoSelect={true}
                            minDate={DateUtils.getCurrentDate(-10)}
                            maxDate={DateUtils.getCurrentDate(+30)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}>
                        <CustomAlert
                            icon={<InfoOutlinedIcon/>}
                            severity="info"
                            variant="outlined"
                        >
                            <CustomTypography lineHeight={2}>
                                دقت شود که با شروع زمان‌بندی دفاع، امکان تغییر تنها زمان شروع و پایان دفاع امکان‌پذیر
                                می‌شود.
                            </CustomTypography>
                        </CustomAlert>
                    </Grid>
                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridItem}
                          justify={"center"}>
                        <Box marginTop={1}>
                            <Button
                                // onClick={registerHandler}
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