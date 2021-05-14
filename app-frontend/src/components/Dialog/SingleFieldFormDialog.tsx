import Button from "@material-ui/core/Button";
import Dialog, {DialogProps} from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import CustomTextField, {CustomTextFieldProps} from "../Text/CustomTextField";

const useStyles = makeStyles((theme) => ({
    justifyAlign: {
        textAlign: "justify",
    },
}));

interface ConfirmDialogProps extends Omit<DialogProps, "onClose" | "onOpen" | "open"> {
    open: boolean,
    onDialogOpenClose: (content?: string) => void,
    title: string,
    descriptions: string[],
    textFieldProps: CustomTextFieldProps,
}

const SingleFieldFormDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();

    const {open, onDialogOpenClose, title, descriptions, textFieldProps, ...rest} = props;
    const [content, setContent] = React.useState("");

    const [errorChecking, setErrorChecking] = React.useState(false);
    const isBlank = (c: string) => errorChecking && c.length === 0;

    const onCommentDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            if (content.length === 0) {
                setErrorChecking(true);
                return;
            }
            onDialogOpenClose(content);
        } else {
            onDialogOpenClose();
        }
    };

    React.useEffect(() => {
        setContent("");
        setErrorChecking(false);
    }, [open])

    return (
        <Dialog
            dir={theme.direction}
            open={open}
            onClose={event => onCommentDialogClose(false)}
            {...rest}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className={classes.justifyAlign}>
                    {
                        descriptions.map((value, index) =>
                            <Typography key={index}>
                                {value}
                            </Typography>
                        )
                    }
                </DialogContentText>
                <CustomTextField
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    helperText={isBlank(content) ? "اطلاعات مربوطه نمی‌تواند خالی باشد." : ""}
                    error={isBlank(content)}
                    {...textFieldProps}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={event => onCommentDialogClose(false)} color="primary">
                    انصراف
                </Button>
                <Button onClick={event => onCommentDialogClose(true)} color="primary" autoFocus>
                    ثبت
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SingleFieldFormDialog;