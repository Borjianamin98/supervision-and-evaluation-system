import Typography from '@material-ui/core/Typography';
import React from 'react';
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, user, setUser, errorChecking} = props;

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    function random(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i += 1) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    const OPTIONS = Array.from(new Array(10))
        .map(() => random(30 + Math.ceil(Math.random() * 20)))
        .sort((a: string, b: string) => a.toUpperCase().localeCompare(b.toUpperCase()));

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                اطلاعات دانشگاهی
            </Typography>
            <ComboBox
                disableListWrap
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                options={OPTIONS}
                renderOption={(option) => <Typography noWrap>{option}</Typography>}
                inputProps={{
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
                inputProps={{
                    label: "دانشکده",
                }}
            />
            <ComboBox
                options={["دانشجو", "استاد"]}
                inputProps={{
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