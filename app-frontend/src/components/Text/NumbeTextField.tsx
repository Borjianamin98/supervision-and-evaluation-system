import React from "react";
import NumberFormat, {NumberFormatProps} from "react-number-format";
import CustomTextField, {CustomTextFieldProps} from "./CustomTextField";

export type NumberTextFieldProps = CustomTextFieldProps & {
    numberFormatProps?: NumberFormatProps,
}

const NumberTextField: React.FunctionComponent<NumberTextFieldProps> = (params) => {
    const {extraInputProps, numberFormatProps, ...rest} = params;

    return (
        <CustomTextField
            extraInputProps={{
                ...extraInputProps,
                inputComponent: CustomNumberFormat as any,
            }}
            extraInnerInputProps={{
                ...numberFormatProps,
            }}
            {...rest}
        />
    )
}

interface CustomNumberFormatProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function CustomNumberFormat(props: CustomNumberFormatProps) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            isNumericString
        />
    );
}

export default NumberTextField;