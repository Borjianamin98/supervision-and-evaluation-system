import Typography from '@material-ui/core/Typography';
import React from 'react';
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
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

    async function loadFunction() {
        await sleep(3000); // For demo purposes.
        return Array.from(new Array(10))
            .map(() => random(30 + Math.ceil(Math.random() * 20)))
            .sort((a: string, b: string) => a.toUpperCase().localeCompare(b.toUpperCase()));
    }

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                اطلاعات دانشگاهی
            </Typography>
            <AsynchronousComboBox
                disableListWrap
                getOptionSelected={(option, value) => option === value}
                getOptionLabel={(option) => option}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                loadingFunction={loadFunction}
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