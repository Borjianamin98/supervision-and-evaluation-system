import {OutlinedInputProps} from "@material-ui/core";
import {FilledInputProps} from "@material-ui/core/FilledInput";
import {InputProps} from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";
import React from "react";

export type CustomTextFieldProps = TextFieldProps & {
    extraInputProps?: Partial<InputProps> | Partial<FilledInputProps> | Partial<OutlinedInputProps>
    textAlign?: "center" | "end" | "justify" | "left" | "right" | "start",
    maxLength?: number,
}

const CustomTextField: React.FunctionComponent<CustomTextFieldProps> = (params) => {
    const {textAlign, maxLength, InputProps, extraInputProps, ...rest} = params;

    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
                ...InputProps,
                ...extraInputProps,
            }}
            inputProps={{
                maxLength: maxLength ?? undefined,
                style: textAlign ? {textAlign: textAlign} : undefined
            }}
            {...rest}
        />
    )
}

export default CustomTextField;