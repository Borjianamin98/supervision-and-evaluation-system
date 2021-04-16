import Typography from "@material-ui/core/Typography";
import Autocomplete, {AutocompleteProps} from '@material-ui/lab/Autocomplete';
import React from 'react';
import CustomTextField, {CustomTextFieldProps} from "../Text/CustomTextField";

interface ComboBoxProps extends Omit<AutocompleteProps<string, false, true, false>, "renderInput"> {
    inputProps?: CustomTextFieldProps
}

const ComboBox: React.FunctionComponent<ComboBoxProps> = (props) => {
    const {options, inputProps, ...rest} = props;

    return (
        <Autocomplete
            {...rest}
            // debug
            noOptionsText={
                <Typography dir="rtl">موردی یافت نشد</Typography>
            }
            options={options}
            disableClearable
            ListboxProps={{
                direction: "rtl"
            }}
            renderInput={(params) =>
                <CustomTextField
                    {...params}
                    {...inputProps}
                    extraInputProps={{autoComplete: 'new-password'}}
                />}
        />
    );
}

export default ComboBox;