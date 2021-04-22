import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {AutocompleteProps} from '@material-ui/lab/Autocomplete';
import React from 'react';
import CustomTextField, {CustomTextFieldProps} from "../Text/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        comboItem: {
            direction: "ltr", // It will be reversed!!
        }
    }));

interface ComboBoxProps extends Omit<AutocompleteProps<string, false, true, false>, "renderInput"> {
    inputProps?: CustomTextFieldProps
}

const ComboBox: React.FunctionComponent<ComboBoxProps> = (props) => {
    const classes = useStyles();
    const {options, inputProps, ...rest} = props;

    return (
        <Autocomplete
            {...rest}
            // debug // Enabled just for debug purpose
            noOptionsText={
                <Typography dir="rtl">موردی یافت نشد</Typography>
            }
            options={options}
            disableClearable
            classes={{
                option: classes.comboItem,
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