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

interface ConfirmDialogProps extends Omit<DialogProps, "onClose" | "onOpen" | "open"> {
    open: boolean,
    onAction: (confirmed: boolean) => void,
    title: string,
    description: string,
}

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const {open, onAction, title, description, ...rest} = props;

    return (
        <Dialog
            dir={theme.direction}
            open={open}
            onClose={() => onAction(false)}
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
                <Button onClick={() => onAction(false)} color="primary" variant={"outlined"}>
                    انصراف
                </Button>
                <Button onClick={() => onAction(true)} color="primary" variant={"outlined"} autoFocus>
                    تایید
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;