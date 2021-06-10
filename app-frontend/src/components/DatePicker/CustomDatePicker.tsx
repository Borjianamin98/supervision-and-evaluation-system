import JalaliUtils from "@date-io/jalaali";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import moment from "moment";
import jMoment from "moment-jalaali";
import React from 'react';
import {ltrTheme, rtlTheme} from "../../App";
import DateUtils from "../../utility/DateUtils";
import CustomTextField from "../Text/CustomTextField";

const useStyles = makeStyles((theme) => ({
    topGrid: {
        margin: theme.spacing(1, 0),
        padding: theme.spacing(2),
    },
    gridItem: {
        padding: theme.spacing(0, 1),
    },
}));

jMoment.loadPersian({dialect: "persian-modern", usePersianDigits: true});

const CustomDatePicker: React.FunctionComponent = () => {
    const classes = useStyles();

    const [selectedDate, setSelectedDate] = React.useState<moment.Moment | null>(moment());

    const handleDateChange = (date: moment.Moment | null) => {
        setSelectedDate(date);
    };

    return (
        <ThemeProvider theme={ltrTheme}>
            <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <DatePicker
                    views={["date"]}
                    minDate={DateUtils.getCurrentDate(-10)}
                    maxDate={DateUtils.getCurrentDate(+10)}
                    disableToolbar={true}
                    margin="normal"
                    variant="dialog"
                    inputVariant="outlined"
                    TextFieldComponent={props =>
                        <ThemeProvider theme={rtlTheme}>
                            <CustomTextField
                                {...props}
                                label="زمان شروع"
                            />
                        </ThemeProvider>
                    }
                    autoOk={true}
                    okLabel=""
                    cancelLabel=""
                    labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

export default CustomDatePicker;