import {ClickAwayListener, Grow, IconButtonProps, MenuListProps, Paper, Popper} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import React from 'react';

type PopperIconButtonChildren = {
    menuListProps: MenuListProps,
    popperClose: (event: React.MouseEvent<EventTarget>) => void,
}

type PopperIconButtonProps = Omit<IconButtonProps, "aria-controls" | "aria-haspopup" | "onClick"> & {
    icon: React.ReactNode,
    children: (props: PopperIconButtonChildren) => React.ReactNode,
};

const PopperIconButton: React.FunctionComponent<PopperIconButtonProps> = (props) => {
    const {icon, ...rest} = props;

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <IconButton
                color="inherit"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                {...rest}
            >
                {icon}
            </IconButton>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                {props.children({
                                    menuListProps: {
                                        id: "menu-list-grow",
                                        autoFocusItem: open,
                                    },
                                    popperClose: handleClose,
                                })}
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export default PopperIconButton;