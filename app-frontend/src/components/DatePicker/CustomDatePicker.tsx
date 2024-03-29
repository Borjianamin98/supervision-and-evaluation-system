import JalaliUtils from "@date-io/jalaali";
import {ThemeProvider} from "@material-ui/core/styles";
import {DatePicker, DatePickerProps, MuiPickersUtilsProvider} from '@material-ui/pickers';
import jMoment from "moment-jalaali";
import React from 'react';
import {ltrTheme, rtlTheme} from "../../App";
import CustomTextField from "../Text/CustomTextField";

jMoment.loadPersian({dialect: "persian-modern", usePersianDigits: true});

interface CustomDatePickerProps extends Omit<DatePickerProps, "onChange" | "value"> {
    label: string,
    selectedDate: moment.Moment,
    onDateChange: (date: moment.Moment) => void,
    autoSelect: boolean,
}

const CustomDatePicker: React.FunctionComponent<CustomDatePickerProps> = (props) => {
    const {label, selectedDate, onDateChange, autoSelect, ...rest} = props;

    const handleDateChange = (date: moment.Moment | null) => {
        if (date) {
            onDateChange(date);
        }
    };

    return (
        <ThemeProvider theme={ltrTheme}>
            <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <DatePicker
                    views={["date"]}
                    disableToolbar={true}
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
                    labelFunc={(date) => (date ? date.format("ddd، jD jMMMM jYYYY") : "")}
                    value={selectedDate}
                    onChange={handleDateChange}
                    {...rest}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

export default CustomDatePicker;