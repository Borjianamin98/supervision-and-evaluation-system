import {IconButtonProps} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import CustomTooltip, {CustomTooltipProps} from "../tooltip/CustomTooltip";

export interface TooltipIconButtonProps extends CustomTooltipProps, IconButtonProps {
}

const TooltipIconButton: React.FunctionComponent<TooltipIconButtonProps> = (props) => {
    const {tooltipTransitionComponent, tooltipTitle, extraTooltipProps, ...rest} = props;

    return (
        <CustomTooltip
            tooltipTransitionComponent={tooltipTransitionComponent}
            tooltipTitle={tooltipTitle}
            extraTooltipProps={extraTooltipProps}
        >
             <span>
                <IconButton {...rest}>
                    {props.children}
                </IconButton>
             </span>
        </CustomTooltip>
    );
}

export default TooltipIconButton;