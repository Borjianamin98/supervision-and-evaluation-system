import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import React from 'react';
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import PasswordTextField from '../../../components/Text/PasswordTextField';
import {genderMapToEnglish, genderMapToPersian, PERSIAN_GENDERS} from "../../../model/enum/gender";
import UserService from "../../../services/api/user/UserService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpGeneralInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, userSave, updateUser, errorChecking} = props;

    const [usernameError, setUsernameError] = React.useState("");

    const isPasswordValid = (password: string) => !errorChecking || UserService.isPasswordValid(password);
    const isEmailValid = (email: string) => !errorChecking || UserService.isEmailValid(email);
    const isTelephoneNumberValid = (telephoneNumber: string) =>
        !errorChecking || UserService.isTelephoneNumberValid(telephoneNumber);
    const isBlank = (c?: string) => errorChecking && (!c || c.length === 0);

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNumbers.length <= 10) {
            updateUser(UserService.updatePhoneNumber(userSave, onlyNumbers));
        }
    }

    const isUsernameBlank = () => {
        if (userSave.username.length === 0) {
            setUsernameError("نام کاربری نمی‌تواند خالی باشد.");
            return true;
        }
        return false;
    }

    const isUsernameValid = () => {
        if (isUsernameBlank()) {
            return;
        }
        UserService.checkAvailableSignInNames(userSave.username)
            .then(value => {
                if (!value.data.available) {
                    setUsernameError("نام کاربری توسط کاربر دیگری انتخاب شده است.");
                } else {
                    setUsernameError("");
                }
            }).catch(() => setUsernameError("ارتباط با سرور برای بررسی حساب کاربری برقرار نمی‌باشد."))
    }

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                مشخصات عمومی
            </Typography>
            <CustomTextField
                required
                label="نام"
                value={userSave.firstName}
                onChange={(e) => updateUser({...userSave, firstName: e.target.value})}
                helperText={isBlank(userSave.firstName) ? "نام کاربر نمی‌تواند خالی باشد." : ""}
                error={isBlank(userSave.firstName)}
            />
            <CustomTextField
                required
                label="نام خانوادگی"
                value={userSave.lastName}
                onChange={(e) => updateUser({...userSave, lastName: e.target.value})}
                helperText={isBlank(userSave.lastName) ? "نام خانوادگی نمی‌تواند خالی باشد." : ""}
                error={isBlank(userSave.lastName)}
            />
            <ComboBox
                options={PERSIAN_GENDERS}
                filterOptions={(options) => options} // do not filter values
                value={genderMapToPersian(userSave.personalInfo.gender)}
                onChange={(e, newValue) =>
                    updateUser(update(userSave, {
                        personalInfo: {
                            gender: () => genderMapToEnglish(newValue),
                        }
                    }))
                }
                textFieldInputProps={{
                    label: "جنسیت",
                }}
            />
            <CustomTextField
                textDir="ltr"
                required
                label="شماره تلفن"
                value={UserService.getPhoneNumberRepresentation(userSave.personalInfo.telephoneNumber)}
                onChange={(e) => handlePhoneNumberChange(e)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">98+</InputAdornment>,
                }}
                helperText={!isTelephoneNumberValid(userSave.personalInfo.telephoneNumber) ? "شماره تلفن معتبر نمی‌باشد." : ""}
                error={!isTelephoneNumberValid(userSave.personalInfo.telephoneNumber)}
            />
            <CustomTextField
                textDir="ltr"
                required
                label="آدرس ایمیل"
                value={userSave.personalInfo.email}
                onChange={(e) =>
                    updateUser(update(userSave, {
                        personalInfo: {
                            email: () => e.target.value,
                        }
                    }))
                }
                helperText={!isEmailValid(userSave.personalInfo.email) ? "آدرس ایمیل معتبر نمی‌باشد." : ""}
                error={!isEmailValid(userSave.personalInfo.email)}
            />
            <Typography className={commonClasses.title} variant="h6">
                حساب کاربری
            </Typography>
            <CustomTextField
                required
                textDir="ltr"
                label="نام کاربری"
                autoComplete="username"
                value={userSave.username}
                onChange={(e) => updateUser({...userSave, username: e.target.value})}
                helperText={errorChecking ? usernameError : ""}
                error={errorChecking && (usernameError.length > 0 || isUsernameBlank())}
                onBlur={() => isUsernameValid()}
            />
            <PasswordTextField
                inputProps={{
                    dir: "ltr"
                }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="رمز عبور"
                value={userSave.password}
                onChange={(e) => updateUser({...userSave, password: e.target.value})}
                helperText={!isPasswordValid(userSave.password) ? "رمز عبور حساب کاربری معتبر نمی‌باشد. (رمز عبور حداقل 8 حرف می‌باشد.)" : ""}
                error={!isPasswordValid(userSave.password)}
            />
        </React.Fragment>
    );
}

export default SignUpGeneralInfo;