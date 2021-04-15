import {ListItem, ListItemIcon, ListItemProps, ListItemText} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import {LinkProps, NavLink} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listItemText: {
            whiteSpace: "nowrap",
            color: "inherit"
        },
        rtl: {
            textAlign: "right",
        }
    }),
);

interface ListItemLinkProps extends ListItemProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const ListItemLink: React.FunctionComponent<ListItemLinkProps> = (props) => {
    const classes = useStyles();
    const {icon, primary, to, dir} = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<LinkProps, 'to'>>((refProps, ref) => (
                <NavLink exact to={to} ref={ref} {...refProps} />
            )),
        [to],
    );

    return (
        <li>
            <ListItem dir={dir} component={renderLink} button>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText
                    className={classNames({
                        [classes.listItemText]: true,
                        [classes.rtl]: dir === "rtl"
                    })}
                    primary={primary}
                />
            </ListItem>
        </li>
    );
}

export default ListItemLink;