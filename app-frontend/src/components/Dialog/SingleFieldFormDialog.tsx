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
    onAction: (content?: string) => void,
    title: string,
    descriptions: string[],
    textFieldProps: CustomTextFieldProps,
}

const SingleFieldFormDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();

    const {open, onAction, title, descriptions, textFieldProps, ...rest} = props;
    const [content, setContent] = React.useState("");

    const [errorChecking, setErrorChecking] = React.useState(false);
    const isBlank = (c: string) => errorChecking && c.length === 0;

    const onCommentDialogClose = (shouldUpdate: boolean) => {
        if (shouldUpdate) {
            if (content.length === 0) {
                setErrorChecking(true);
                return;
            }
            onAction(content);
        } else {
            onAction();
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
            onClose={() => onCommentDialogClose(false)}
            {...rest}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText component="div" className={classes.justifyAlign}>
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
                <Button onClick={() => onCommentDialogClose(false)} color="primary" variant={"outlined"}>
                    انصراف
                </Button>
                <Button onClick={() => onCommentDialogClose(true)} color="primary" variant={"outlined"}>
                    ثبت
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SingleFieldFormDialog;