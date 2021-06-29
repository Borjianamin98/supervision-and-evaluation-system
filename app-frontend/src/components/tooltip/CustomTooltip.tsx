import {TooltipProps, Zoom} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

export interface CustomTooltipProps {
    tooltipTitle: string,
    tooltipTransitionComponent?: TooltipProps["TransitionComponent"],
    extraTooltipProps?: Omit<TooltipProps, "TransitionComponent" | "children" | "title">,
}

const CustomTooltip: React.FunctionComponent<CustomTooltipProps> = (props) => {
    const {tooltipTransitionComponent, tooltipTitle, extraTooltipProps} = props;

    return (
        <Tooltip
            TransitionComponent={tooltipTransitionComponent ?? Zoom}
            title={tooltipTitle}
            {...extraTooltipProps}
        >
             <span>
                {props.children}
             </span>
        </Tooltip>
    );
}

export default CustomTooltip;