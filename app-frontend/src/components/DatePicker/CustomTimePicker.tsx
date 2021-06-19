import JalaliUtils from "@date-io/jalaali";
import {ThemeProvider} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider, TimePicker, TimePickerProps} from '@material-ui/pickers';
import jMoment from "moment-jalaali";
import React from 'react';
import {ltrTheme, rtlTheme} from "../../App";
import CustomTextField from "../Text/CustomTextField";

jMoment.loadPersian({dialect: "persian-modern", usePersianDigits: true});

interface CustomDatePickerProps extends Omit<TimePickerProps, "onChange" | "value"> {
    label: string,
    selectedDate: moment.Moment,
    onDateChange: (date: moment.Moment) => void,
    autoSelect: boolean,
}

const CustomTimePicker: React.FunctionComponent<CustomDatePickerProps> = (props) => {
    const {label, selectedDate, onDateChange, autoSelect, ...rest} = props;

    const handleDateChange = (date: moment.Moment | null) => {
        if (date) {
            onDateChange(date);
        }
    };

    return (
        <ThemeProvider theme={ltrTheme}>
            <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <TimePicker
                    views={["hours", "minutes"]}
                    openTo="hours"
                    ampm={true}
                    margin="normal"
                    variant="dialog"
                    inputVariant="outlined"
                    TextFieldComponent={props =>
                        <ThemeProvider theme={rtlTheme}>
                            <CustomTextField
                                {...props}
                                label={label}
                            />
                        </ThemeProvider>
                    }
                    autoOk={autoSelect ?? true}
                    okLabel={autoSelect ? "" : "تأیید"}
                    cancelLabel={autoSelect ? "" : "لغو"}
                    minDateMessage={"زمان انتخاب شده نمی‌تواند قبل از حداقل زمانی باشد."}
                    maxDateMessage={"زمان انتخاب شده نمی‌تواند بعد از حداکثر زمانی باشد."}
                    minutesStep={5}
                    value={selectedDate}
                    onChange={handleDateChange}
                    {...rest}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

export default CustomTimePicker;