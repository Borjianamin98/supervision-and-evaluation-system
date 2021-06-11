import JalaliUtils from "@date-io/jalaali";
import {ThemeProvider} from "@material-ui/core/styles";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import moment from "moment";
import jMoment from "moment-jalaali";
import React from 'react';
import {ltrTheme, rtlTheme} from "../../App";
import DateUtils from "../../utility/DateUtils";
import CustomTextField from "../Text/CustomTextField";

jMoment.loadPersian({dialect: "persian-modern", usePersianDigits: true});

interface CustomDatePickerProps {
    label: string,
    selectedDate: moment.Moment,
    onDateChange: (moment: moment.Moment) => void,
    autoSelect: boolean,
}

const CustomDatePicker: React.FunctionComponent<CustomDatePickerProps> = (props) => {
    const {label, selectedDate, onDateChange, autoSelect} = props;

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
                                label={label}
                            />
                        </ThemeProvider>
                    }
                    autoOk={autoSelect ?? true}
                    okLabel={autoSelect ? "" : "تأیید"}
                    cancelLabel={autoSelect ? "" : "لغو"}
                    labelFunc={(date) => (date ? date.format("ddd، jD jMMMM jYYYY") : "")}
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

export default CustomDatePicker;