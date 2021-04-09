import {IconButton} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageInput: {
            display: 'none',
        },
    }),
);

interface InputIconButtonProps {
    accept: string,
    onFileChange?: React.ChangeEventHandler<HTMLInputElement>
}

const InputFileIconButton: React.FunctionComponent<InputIconButtonProps> = (props) => {
    const classes = useStyles();
    return (
        <>
            <input
                className={classes.imageInput}
                onChange={props.onFileChange}
                accept={props.accept}
                id="icon-button-file"
                type="file"
            />
            <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload file" component="span">
                    {props.children}
                </IconButton>
            </label>
        </>
    );
}

export default InputFileIconButton;