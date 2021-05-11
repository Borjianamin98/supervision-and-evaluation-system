import {ClickAwayListener, Fade, IconButtonProps, Popper} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import React from 'react';

type PopperIconButtonProps = Omit<IconButtonProps, "aria-owns" | "aria-haspopup" | "onClick"> & {
    icon: React.ReactNode,
    children: (popperClose: () => void) => React.ReactNode,
};

const PopperIconButton: React.FunctionComponent<PopperIconButtonProps> = (props) => {
    const {icon, ...rest} = props;

    const [buttonAnchorEl, setButtonAnchorEl] = React.useState<null | HTMLElement>(null);
    const openPopperId = Boolean(buttonAnchorEl) ? 'transitions-popper' : undefined;
    const handlePopperClose = () => {
        setButtonAnchorEl(null);
    };
    const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
        setButtonAnchorEl(buttonAnchorEl ? null : event.currentTarget);
    };

    return (
        <div>
            <IconButton
                color="inherit"
                aria-owns={openPopperId}
                aria-haspopup="true"
                onClick={handleClickButton}
                {...rest}
            >
                {icon}
            </IconButton>
            <Popper
                id={openPopperId}
                open={Boolean(buttonAnchorEl)}
                anchorEl={buttonAnchorEl}
                transition
                disablePortal
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <ClickAwayListener onClickAway={handlePopperClose}>
                            {props.children(handlePopperClose)}
                        </ClickAwayListener>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default PopperIconButton;