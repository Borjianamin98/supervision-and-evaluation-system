import {IconButtonProps, TooltipProps, Zoom} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

interface TooltipIconButtonProps extends IconButtonProps {
    tooltipTitle: string,
    tooltipTransitionComponent?: TooltipProps["TransitionComponent"],
    extraTooltipProps?: Omit<TooltipProps, "TransitionComponent" | "children" | "title">,
}

const TooltipIconButton: React.FunctionComponent<TooltipIconButtonProps> = (props) => {
    const {tooltipTransitionComponent, tooltipTitle, extraTooltipProps, ...rest} = props;

    return (
        <Tooltip TransitionComponent={tooltipTransitionComponent ?? Zoom} title={tooltipTitle} {...extraTooltipProps}>
             <span>
                <IconButton {...rest}>
                    {props.children}
                </IconButton>
             </span>
        </Tooltip>
    );
}

export default TooltipIconButton;