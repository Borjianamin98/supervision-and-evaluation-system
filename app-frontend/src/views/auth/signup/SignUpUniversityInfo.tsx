import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {Role, roleMapToEnglish, roleMapToPersian} from "../../../model/enum/role";
import {University} from "../../../model/university/university";
import FacultyService from "../../../services/api/university/faculty/FacultyService";
import UniversityService from "../../../services/api/university/UniversityService";
import StudentService from "../../../services/api/user/StudentService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, extraUserInfo, setExtraUserInfo, faculty, setFaculty, errorChecking} = props;
    const [university, setUniversity] = useState<University>(UniversityService.createInitialUniversity());

    function retrieveUniversities() {
        // TODO: We should use pagination and filter result based on search before retrieving universities.
        return UniversityService.retrieveUniversities(Number.MAX_SAFE_INTEGER, 0)
            .then(value => value.data.content)
    }

    function loadUniversityFaculties(universityId: number) {
        return FacultyService.retrieveUniversityFaculties(universityId, Number.MAX_SAFE_INTEGER, 0)
            .then(value => value.data.content)
    }

    const handleStudentNumberChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        setExtraUserInfo({...extraUserInfo, studentNumber: onlyNumbers})
    }

    const isStudentNumberValid = (c: string) => !errorChecking || StudentService.isStudentNumberValid(c);
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
                loadingFunction={retrieveUniversities}
                textFieldInputProps={{
                    label: "دانشگاه",
                    helperText: (isNotBlank(university.name) ? "" : "دانشگاه مربوطه باید انتخاب شود."),
                    error: !isNotBlank(university.name),
                }}
                value={university}
                onChange={(e, newValue) => {
                    setUniversity(newValue);
                    setFaculty(FacultyService.createInitialFaculty());
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
                options={[Role.STUDENT, Role.MASTER].map(role => roleMapToPersian(role))}
                value={roleMapToPersian(extraUserInfo.role)}
                onChange={(e, newValue) =>
                    setExtraUserInfo({...extraUserInfo, role: roleMapToEnglish(newValue)})}
                textFieldInputProps={{
                    label: "نوع کاربری",
                    helperText: (isNotBlank(extraUserInfo.role) ? "" : "نوع کاربری باید انتخاب شود."),
                    error: !isNotBlank(extraUserInfo.role),
                }}
            />
            {extraUserInfo.role === Role.MASTER ? <CustomTextField
                required
                label="مدرک"
                value={extraUserInfo.degree}
                onChange={(e) =>
                    setExtraUserInfo({...extraUserInfo, degree: e.target.value})}
                helperText={isNotBlank(extraUserInfo.degree) ? "" : "مدرک تصحیلی را باید مشخص کنید."}
                error={!isNotBlank(extraUserInfo.degree)}
                maxLength={40}
            /> : undefined}
            {extraUserInfo.role === Role.STUDENT ? <CustomTextField
                required
                label="شماره دانشجویی"
                value={extraUserInfo.studentNumber}
                onChange={handleStudentNumberChange}
                helperText={isStudentNumberValid(extraUserInfo.studentNumber) ? "" : "شماره دانشجویی را باید مشخص کنید."}
                error={!isStudentNumberValid(extraUserInfo.studentNumber)}
                maxLength={20}
            /> : undefined}
        </React.Fragment>
    );
}

export default SignUpUniversityInfo;