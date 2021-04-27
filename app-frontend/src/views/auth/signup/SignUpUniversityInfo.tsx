import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {University} from "../../../model/university/university";
import UniversityService from "../../../services/api/university/UniversityService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, user, setUser, faculty, setFaculty, errorChecking} = props;
    const [university, setUniversity] = useState<University>(UniversityService.createInitialUniversity());

    function loadUniversities() {
        return UniversityService.retrieveUniversities()
            .then(value => value.data)
    }

    function loadUniversityFaculties(universityId: number) {
        return UniversityService.retrieveUniversityFaculties(universityId)
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
                    helperText: (isNotBlank(university.name) ? "" : "دانشگاه مربوطه باید انتخاب شود."),
                    error: !isNotBlank(university.name),
                }}
                value={university}
                onChange={(e, newValue) => {
                    setUniversity(newValue);
                    setFaculty(UniversityService.createInitialFaculty());
                }}
            />
            <AsynchronousComboBox
                disableListWrap
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(option) => <Typography noWrap>{option.name}</Typography>}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                loadingFunction={() => loadUniversityFaculties(university.id!)}
                textFieldInputProps={{
                    label: "دانشکده",
                    helperText: (isNotBlank(faculty.name) ? "" : "دانشکده مربوطه باید انتخاب شود."),
                    error: !isNotBlank(faculty.name),
                }}
                value={faculty}
                onChange={(e, newValue) => setFaculty(newValue)}
                disabled={university.name.length === 0}
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