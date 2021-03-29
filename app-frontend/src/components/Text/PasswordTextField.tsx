import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import {IconButton} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {TextFieldProps} from "@material-ui/core/TextField/TextField";

type PasswordTextFieldProps = Omit<TextFieldProps, "type" | "autoComplete">;

const PasswordTextField: React.FunctionComponent<PasswordTextFieldProps> = (props) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <TextField
            {...props}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(prevState => !prevState)}
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
        />
    );
}

export default PasswordTextField;