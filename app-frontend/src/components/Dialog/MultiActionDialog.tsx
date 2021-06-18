import Button from "@material-ui/core/Button";
import Dialog, {DialogProps} from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme) => ({
    justifyAlign: {
        textAlign: "justify",
    },
}));

interface MultiActionDialogProps extends Omit<DialogProps, "onClose" | "onOpen" | "open"> {
    title: string,
    description: string,
    open: boolean,
    actions: { name: string, content: string }[],
    onClose: (reason: "closed" | string) => void,
}

const MultiActionDialog: React.FunctionComponent<MultiActionDialogProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const {title, description, open, onClose, actions, ...rest} = props;

    return (
        <Dialog
            dir={theme.direction}
            open={open}
            onClose={() => onClose("closed")}
            {...rest}
        >
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description" className={classes.justifyAlign}>
                    {description}
                </DialogContentText>
                {props.children}
            </DialogContent>
            <DialogActions>
                {
                    actions.map(action =>
                        <Button key={action.name}
                                onClick={() => onClose(action.name)}
                                color="primary"
                        >
                            {action.content}
                        </Button>)
                }
            </DialogActions>
        </Dialog>
    )
}

export default MultiActionDialog;