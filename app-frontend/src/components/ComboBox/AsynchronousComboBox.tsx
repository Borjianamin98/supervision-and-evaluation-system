import Typography from '@material-ui/core/Typography';
import React from 'react';
import ComboBox, {ComboBoxProps} from './ComboBox';

type AsynchronousComboBoxProps<T> = Omit<ComboBoxProps<T>, "options"> & {
    loadingFunction: () => Promise<T[]>
}

function AsynchronousComboBox<T>(props: AsynchronousComboBoxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>([]);
    const loading = open && options.length === 0;

    const {loadingFunction, ...rest} = props;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const retrievedOptions = await loadingFunction();
            if (active) {
                setOptions(retrievedOptions);
            }
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
                loading ? (<Typography dir="rtl">در حال بارگیری ...</Typography>) : (
                    <Typography dir="rtl">موردی یافت نشد</Typography>)
            }
            renderOption={(option) => <Typography noWrap>{option}</Typography>}
            {...rest}
        />
    );
}

export default AsynchronousComboBox;