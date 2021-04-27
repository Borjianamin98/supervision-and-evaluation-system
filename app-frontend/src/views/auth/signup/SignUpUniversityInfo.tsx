import Typography from '@material-ui/core/Typography';
import React from 'react';
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {SignUpSectionsProps} from "./SignUpView";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

function random(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, user, setUser, errorChecking} = props;
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<string[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(3000); // For demo purposes.
            const OPTIONS = Array.from(new Array(10))
                .map(() => random(30 + Math.ceil(Math.random() * 20)))
                .sort((a: string, b: string) => a.toUpperCase().localeCompare(b.toUpperCase()));

            if (active) {
                setOptions(OPTIONS);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                اطلاعات دانشگاهی
            </Typography>
            <ComboBox
                disableListWrap
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionSelected={(option, value) => option === value}
                getOptionLabel={(option) => option}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                options={options}
                noOptionsText={
                    loading ? (<Typography dir="rtl">در حال بارگیری ...</Typography>) : (
                        <Typography dir="rtl">موردی یافت نشد</Typography>)
                }
                renderOption={(option) => <Typography noWrap>{option}</Typography>}
                textFieldInputProps={{
                    label: "دانشگاه",
                    helperText: (!isNotBlank(user.university) ? "دانشگاه مربوطه باید انتخاب شود." : ""),
                    error: !isNotBlank(user.university),
                }}
                value={user.university}
                onChange={(e, newValue) =>
                    setUser({...user, university: newValue})
                }
            />
            <ComboBox
                options={["لیست دانشکده‌ها"]}
                textFieldInputProps={{
                    label: "دانشکده",
                }}
            />
            <ComboBox
                options={["دانشجو", "استاد"]}
                textFieldInputProps={{
                    label: "نوع کاربری",
                }}
            />
            <CustomTextField
                required
                label="مدرک"
            />
            <CustomTextField
                required
                label="شماره دانشجویی"
            />
        </React.Fragment>
    );
}

export default SignUpUniversityInfo;