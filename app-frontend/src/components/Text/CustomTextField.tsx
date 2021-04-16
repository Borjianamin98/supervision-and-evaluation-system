import {InputBaseComponentProps} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";
import React from "react";

type CustomTextFieldProps = TextFieldProps & {
    textDirection?: "rtl" | "ltr",
    extraInputProps?: InputBaseComponentProps
}

const CustomTextField: React.FunctionComponent<CustomTextFieldProps> = (params) => {
    const {label, textDirection, extraInputProps, ...rest} = params;
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            inputProps={{
                dir: textDirection ?? "rtl",
                ...extraInputProps
            }}
            label={label}
            {...rest}
        />
    )
}

export default CustomTextField;