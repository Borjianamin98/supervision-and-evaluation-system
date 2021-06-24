import React from 'react';
import NumberTextField, {NumberTextFieldProps} from "../../../../components/Text/NumbeTextField";

const PointNumberTextField: React.FunctionComponent<Omit<NumberTextFieldProps, "numberFormatProps">> = (props) => {
    return (
        <NumberTextField
            numberFormatProps={{
                allowNegative: false,
                decimalScale: 2,
                isAllowed: (values) => values.floatValue !== undefined
                    && values.floatValue >= 0 && values.floatValue <= 20,
            }}
            {...props}
        />
    );
}

export default PointNumberTextField;