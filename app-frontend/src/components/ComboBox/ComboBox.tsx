import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {AutocompleteProps} from '@material-ui/lab/Autocomplete';
import {ClassNameMap} from "notistack";
import React, {PropsWithChildren} from 'react';
import CustomTextField, {CustomTextFieldProps} from "../Text/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        comboItem: {
            direction: "ltr", // It will be reversed!!
        }
    }));

type ComboBoxProps<T> = Omit<AutocompleteProps<T, false, true, false>, "renderInput"> & {
    textFieldInputProps?: CustomTextFieldProps,
    extraClasses?: Partial<ClassNameMap>,
}

function ComboBox<T>(props: PropsWithChildren<ComboBoxProps<T>>) {
    const classes = useStyles();
    const {options, textFieldInputProps, extraClasses, ...rest} = props;

    return (
        <Autocomplete
            noOptionsText={
                <Typography dir="rtl">موردی یافت نشد</Typography>
            }
            {...rest}
            // debug={true} // Enabled just for debug purpose
            options={options}
            disableClearable
            classes={{
                option: classes.comboItem,
                ...extraClasses
            }}
            renderInput={(params) =>
                <CustomTextField
                    {...params}
                    {...textFieldInputProps}
                    extraInputProps={{
                        ...params.InputProps,
                        ...textFieldInputProps?.extraInputProps,
                        autoComplete: 'new-password',
                    }}
                />}
        />
    );
}

export default ComboBox;