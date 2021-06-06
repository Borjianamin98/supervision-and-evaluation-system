import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
import CustomAlert from "../../../components/Alert/CustomAlert";
import AsynchronousComboBox from "../../../components/ComboBox/AsynchronousComboBox";
import ComboBox from "../../../components/ComboBox/ComboBox";
import {VirtualizedListBoxComponent, VirtualizedListBoxStyles} from "../../../components/ComboBox/VirtualizedComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import {Role, roleMapToEnglish, roleMapToPersian} from "../../../model/enum/role";
import {University} from "../../../model/university/University";
import FacultyService from "../../../services/api/university/faculty/FacultyService";
import UniversityService from "../../../services/api/university/UniversityService";
import StudentService from "../../../services/api/user/StudentService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpUniversityInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, extraUserInfo, setExtraUserInfo, faculty, updateFaculty, errorChecking} = props;
    const [university, setUniversity] = useState<University>();

    function retrieveUniversities(inputValue: string) {
        return UniversityService.retrieveUniversities(100, 0, inputValue)
            .then(value => value.content)
    }

    function retrieveUniversityFaculties(inputValue: string) {
        return FacultyService.retrieveUniversityFaculties(university!.id, 100, 0, inputValue)
            .then(value => value.content)
    }

    const handleStudentNumberChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        setExtraUserInfo({...extraUserInfo, studentNumber: onlyNumbers})
    }

    const isStudentNumberValid = (c: string) => !errorChecking || StudentService.isStudentNumberValid(c);
    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);

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
                ListboxComponent={VirtualizedListBoxComponent}
                loadingFunction={retrieveUniversities}
                textFieldInputProps={{
                    label: "دانشگاه",
                    helperText: (isBlank(university?.name) ? "دانشگاه مربوطه باید انتخاب شود." : ""),
                    error: isBlank(university?.name),
                }}
                // Initial value is necessary for comboBox to become controlled component.
                // More info: https://stackoverflow.com/a/37427596/3739748
                value={university ?? {id: 0, name: "", location: "", webAddress: ""}}
                onChange={(e, newValue) => {
                    setUniversity(newValue);
                    updateFaculty(undefined);
                }}
            />
            <AsynchronousComboBox
                disableListWrap
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                renderOption={(option) => <Typography noWrap>{option.name}</Typography>}
                extraClasses={VirtualizedListBoxStyles()}
                ListboxComponent={VirtualizedListBoxComponent}
                loadingFunction={retrieveUniversityFaculties}
                textFieldInputProps={{
                    label: "دانشکده",
                    helperText: (isBlank(faculty?.name) ? "دانشکده مربوطه باید انتخاب شود." : ""),
                    error: isBlank(faculty?.name),
                }}
                // Initial value is necessary for comboBox to become controlled component.
                // More info: https://stackoverflow.com/a/37427596/3739748
                value={faculty ?? {id: 0, name: "", webAddress: ""}}
                onChange={(e, newValue) => updateFaculty(newValue)}
                disabled={university === undefined}
            />
            <CustomAlert severity="info">
                در صورت وجود تعداد زیادی نتیجه، تنها بخشی از آن نمایش داده می‌شود. برای یافتن سریع‌تر، جستجوی خود را
                دقیق‌تر نمایید.
            </CustomAlert>
            <ComboBox
                options={[Role.STUDENT, Role.MASTER].map(role => roleMapToPersian(role))}
                value={roleMapToPersian(extraUserInfo.role)}
                onChange={(e, newValue) =>
                    setExtraUserInfo({...extraUserInfo, role: roleMapToEnglish(newValue)})}
                textFieldInputProps={{
                    label: "نوع کاربری",
                    helperText: (isBlank(extraUserInfo.role) ? "نوع کاربری باید انتخاب شود." : ""),
                    error: isBlank(extraUserInfo.role),
                }}
            />
            {extraUserInfo.role === Role.MASTER ? <CustomTextField
                required
                label="مدرک"
                value={extraUserInfo.degree}
                onChange={(e) =>
                    setExtraUserInfo({...extraUserInfo, degree: e.target.value})}
                helperText={isBlank(extraUserInfo.degree) ? "مدرک تصحیلی را باید مشخص کنید." : ""}
                error={isBlank(extraUserInfo.degree)}
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