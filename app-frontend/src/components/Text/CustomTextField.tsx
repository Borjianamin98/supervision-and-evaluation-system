import {OutlinedInputProps} from "@material-ui/core";
import {FilledInputProps} from "@material-ui/core/FilledInput";
import {InputProps} from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";
import React from "react";

export type CustomTextFieldProps = TextFieldProps & {
    extraInputProps?: Partial<InputProps> | Partial<FilledInputProps> | Partial<OutlinedInputProps>
    textDir?: "ltr" | "rtl",
    maxLength?: number,
}

const CustomTextField: React.FunctionComponent<CustomTextFieldProps> = (params) => {
    const {textDir, maxLength, InputProps, extraInputProps, ...rest} = params;

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
                dir: textDir ? textDir : undefined
            }}
            {...rest}
        />
    )
}

export default CustomTextField;