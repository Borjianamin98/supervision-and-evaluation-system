import {ButtonProps} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import {NavLink, NavLinkProps} from "react-router-dom";

interface ButtonLinkProps extends ButtonProps<NavLink> {
    to: string;
}

const ButtonLink: React.FunctionComponent<ButtonLinkProps> = (props) => {
    const {to, ...rest} = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<NavLinkProps, 'to'>>((refProps, ref) => (
                <NavLink exact to={to} ref={ref} {...refProps} />
            )),
        [to],
    );

    return (
        <Button
            component={renderLink}
            {...rest}
        >
            {props.children}
        </Button>
    );
}

export default ButtonLink;