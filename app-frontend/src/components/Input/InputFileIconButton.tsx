import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageInput: {
            display: 'none',
        },
    }),
);

interface InputFileIconButtonProps {
    accept: string,
    onFileChange: (file: File) => void,
}

const InputFileIconButton: React.FunctionComponent<InputFileIconButtonProps> = (props) => {
    const classes = useStyles();
    const {accept, onFileChange} = props;

    return (
        <>
            <input
                className={classes.imageInput}
                onChange={(event) => {
                    const target = event.target;
                    if (!target.files) {
                        return; // User canceled upload file window
                    }
                    onFileChange(target.files[0]);
                }}
                accept={accept}
                id="icon-button-file"
                type="file"
            />
            <label htmlFor="icon-button-file">
                {/* inner component should be inherited from <span> class */}
                {props.children}
            </label>
        </>
    );
}

export default InputFileIconButton;