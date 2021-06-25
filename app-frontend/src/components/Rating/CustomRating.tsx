import {Box, BoxProps} from "@material-ui/core";
import Rating, {RatingProps} from "@material-ui/lab/Rating";
import React from "react";
import CenterBox from "../Grid/CenterBox";

const labels: { [index: string]: string } = {
    1: "خیلی ضعیف",
    2: "ضعیف",
    3: "متوسط",
    4: "خوب",
    5: "عالی",
};

interface CustomRatingProps extends Omit<RatingProps, "value" | "precision" | "onChange" | "onChangeActive"> {
    value: number,
    onValueChange: (newValue: number) => void,
    labelPosition: "left" | "right" | "none",
    boxProps?: BoxProps,
}

const CustomRating: React.FunctionComponent<CustomRatingProps> = (params) => {
    const {value, onValueChange, labelPosition, boxProps, ...rest} = params;

    const [hover, setHover] = React.useState(-1);

    return (
        <CenterBox flexDirection={labelPosition === "left" ? "row" : "row-reverse"} {...boxProps}>
            <Rating
                value={value}
                precision={1}
                onChange={(event, newValue) => onValueChange(newValue ? newValue : value)}
                onChangeActive={(event, newHover) => setHover(newHover)}
                {...rest}
            />
            <Box
                marginLeft={labelPosition === "left" ? 2 : undefined}
                marginRight={labelPosition === "right" ? 2 : undefined}
                display={labelPosition === "none" ? "none" : undefined}
            >
                {labels[hover !== -1 ? hover : value]}
            </Box>
        </CenterBox>
    )
}

export default CustomRating;