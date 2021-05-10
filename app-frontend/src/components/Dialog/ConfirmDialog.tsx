import Button from "@material-ui/core/Button";
import Dialog, {DialogProps} from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from 'react';

interface ConfirmDialogProps extends Omit<DialogProps, "onClose" | "onOpen" | "open"> {
    open: boolean,
    onDialogOpenClose: (confirmed: boolean) => void,
    title: string,
    description: string,
}

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const {open, onDialogOpenClose, title, description, ...rest} = props;

    return (
        <Dialog
            dir="rtl"
            open={open}
            onClose={event => onDialogOpenClose(false)}
            {...rest}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={event => onDialogOpenClose(false)} color="primary">
                    انصراف
                </Button>
                <Button onClick={event => onDialogOpenClose(true)} color="primary" autoFocus>
                    تایید
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;