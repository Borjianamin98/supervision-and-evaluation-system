import Typography from '@material-ui/core/Typography';
import React from 'react';
import ComboBox, {ComboBoxProps} from './ComboBox';

type AsynchronousComboBoxProps<T> = Omit<ComboBoxProps<T>, "options"> & {
    loadingFunction: () => Promise<T[]>
}

function AsynchronousComboBox<T>(props: AsynchronousComboBoxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>([]);
    const [noOptionsText, setNoOptionsText] = React.useState<string>("");
    const loading = open && options.length === 0;

    const {loadingFunction, ...rest} = props;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }
        setNoOptionsText("در حال بارگیری ...");

        (async () => {
            loadingFunction()
                .then(retrievedOptions => {
                    if (active) {
                        setOptions(retrievedOptions);
                    }
                })
                .catch(reason => setNoOptionsText("در بارگیری اطلاعات خطایی رخ داده است"));
        })();

        return () => {
            active = false;
        };
    }, [loading, loadingFunction]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

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
            noOptionsText={
                loading ? (<Typography dir="rtl">{noOptionsText}</Typography>) : (
                    <Typography dir="rtl">موردی یافت نشد</Typography>)
            }
            {...rest}
        />
    );
}

export default AsynchronousComboBox;