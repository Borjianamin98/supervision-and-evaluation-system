import Typography from '@material-ui/core/Typography';
import React from 'react';
import {LoadingState} from "../../model/enum/loadingState";
import ComboBox, {ComboBoxProps} from './ComboBox';

type AsynchronousComboBoxProps<T> = Omit<ComboBoxProps<T>, "options"> & {
    loadingFunction: (inputValue: string) => Promise<T[]>,
}

function AsynchronousComboBox<T>(props: AsynchronousComboBoxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>([]);
    const [inputValue, setInputValue] = React.useState("");
    const [loadingState, setLoadingState] = React.useState(LoadingState.LOADED);

    const {loadingFunction, ...rest} = props;

    React.useEffect(() => {
        let active = true;

        if (loadingState === LoadingState.LOADED
            || loadingState === LoadingState.FAILED /* Ignore failed state until reopen combo box again */) {
            return undefined;
        }

        (async () => {
            loadingFunction(inputValue)
                .then(retrievedOptions => {
                    if (active) {
                        setOptions(retrievedOptions);
                    }
                    setLoadingState(LoadingState.LOADED);
                })
                .catch(reason => {
                    setLoadingState(LoadingState.FAILED);
                });
        })();

        return () => {
            active = false;
        };
    }, [inputValue, loadingFunction, loadingState]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
            setLoadingState(LoadingState.LOADED);
        } else {
            setLoadingState(LoadingState.SHOULD_RELOAD);
        }
    }, [open]);

    const noOptionsTextValue = (state: LoadingState) => {
        switch (state) {
            case LoadingState.LOADING:
            case LoadingState.SHOULD_RELOAD:
                return <Typography>در حال بارگیری ...</Typography>;
            case LoadingState.LOADED:
                if (options.length === 0) {
                    return <Typography>داده‌ای موجود نیست.</Typography>;
                } else {
                    // Happens in case of searching for a keyword.
                    return <Typography>موردی یافت نشد.</Typography>;
                }
            case LoadingState.FAILED:
                return <Typography>در بارگیری اطلاعات خطایی رخ داده است.</Typography>;
        }
    }

    return (
        <ComboBox
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            noOptionsText={<div dir="rtl">{noOptionsTextValue(loadingState)}</div>}
            inputValue={inputValue}
            onInputChange={(event, value) => {
                setInputValue(value);
                setLoadingState(LoadingState.SHOULD_RELOAD);
            }}
            {...rest}
        />
    );
}

export default AsynchronousComboBox;