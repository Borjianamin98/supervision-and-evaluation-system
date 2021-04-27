import Typography from '@material-ui/core/Typography';
import React from 'react';
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import UniversityService from "../../../services/api/university/UniversityService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, user, setUser, university, setUniversity, errorChecking} = props;

    function loadUniversities() {
        return UniversityService.retrieveUniversities()
            .then(value => value.data)
    }

    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                اطلاعات دانشگاهی
            </Typography>
            <AsynchronousComboBox
                disableListWrap
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(option) => <Typography noWrap>{option.name}</Typography>}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                loadingFunction={loadUniversities}
                textFieldInputProps={{
                    label: "دانشگاه",
                    helperText: (!isNotBlank(university.name) ? "دانشگاه مربوطه باید انتخاب شود." : ""),
                    error: !isNotBlank(university.name),
                }}
                value={university}
                onChange={(e, newValue) => setUniversity(newValue)}
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