import {OutlinedInputProps} from "@material-ui/core";
import {FilledInputProps} from "@material-ui/core/FilledInput";
import {InputProps} from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";
import React from "react";

export type CustomTextFieldProps = TextFieldProps & {
    textAlign?: "center" | "end" | "justify" | "left" | "right" | "start",
    extraInputProps?: Partial<InputProps> | Partial<FilledInputProps> | Partial<OutlinedInputProps>
}

const CustomTextField: React.FunctionComponent<CustomTextFieldProps> = (params) => {
    const {label, textAlign, InputProps, extraInputProps, ...rest} = params;
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
                ...InputProps,
                ...extraInputProps,
            }}
            inputProps={textAlign ? ({style: {textAlign: textAlign}}) : undefined}
            label={label}
            {...rest}
        />
    )
}

export default CustomTextField;