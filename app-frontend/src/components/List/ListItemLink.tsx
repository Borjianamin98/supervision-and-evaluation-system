import React from "react";
import {ListItem, ListItemIcon, ListItemProps, ListItemText} from "@material-ui/core";
import {Link, LinkProps} from "react-router-dom";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listItemText: {
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
            React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
                <Link to={to} ref={ref} {...itemProps} />
            )),
        [to],
    );

    return (
        <li>
            <ListItem dir={dir} component={renderLink} button>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText className={classes.listItemText} primary={primary}/>
            </ListItem>
        </li>
    );
}

export default ListItemLink;