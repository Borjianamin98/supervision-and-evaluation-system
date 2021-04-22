import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {AutocompleteProps} from '@material-ui/lab/Autocomplete';
import React, {PropsWithChildren} from 'react';
import CustomTextField, {CustomTextFieldProps} from "../Text/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        comboItem: {
            direction: "ltr", // It will be reversed!!
        }
    }));

type ComboBoxProps<T> = Omit<AutocompleteProps<T, false, true, false>, "renderInput"> & {
    inputProps?: CustomTextFieldProps
}

function ComboBox<T>(props: PropsWithChildren<ComboBoxProps<T>>) {
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