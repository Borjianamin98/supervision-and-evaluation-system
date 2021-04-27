import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import React from 'react';
import ComboBox from "../../../components/ComboBox/ComboBox";
import CustomTextField from "../../../components/Text/CustomTextField";
import PasswordTextField from '../../../components/Text/PasswordTextField';
import {genderMapToEnglish, genderMapToPersian, PERSIAN_GENDERS} from "../../../model/enum/gender";
import UserService from "../../../services/api/UserService";
import {SignUpSectionsProps} from "./SignUpView";

const SignUpGeneralInfo: React.FunctionComponent<SignUpSectionsProps> = (props) => {
    const {commonClasses, user, setUser, errorChecking} = props;

    const isEmailValid = (email: string) => !errorChecking || UserService.isEmailValid(email);
    const isTelephoneNumberValid = (telephoneNumber: string) =>
        !errorChecking || UserService.isTelephoneNumberValid(telephoneNumber.replaceAll(' ', ''));
    const isNotBlank = (c: string) => !errorChecking || c.length > 0;

    const setPhoneNumber = (telephoneNumber: string) => {
        setUser(update(user, {personalInfo: {telephoneNumber: () => telephoneNumber}}))
    }

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        if (onlyNumbers.length < 10) {
            setPhoneNumber(onlyNumbers);
        } else if (onlyNumbers.length === 10) {
            const number = onlyNumbers.replace(
                /(\d{3})(\d{3})(\d{4})/,
                '$1 $2 $3'
            );
            setPhoneNumber(number);
        }
    }

    return (
        <React.Fragment>
            <Typography className={commonClasses.title} variant="h6">
                مشخصات عمومی
            </Typography>
            <CustomTextField
                required
                label="نام"
                value={user.firstName}
                onChange={(e) =>
                    setUser({...user, firstName: e.target.value})}
                helperText={!isNotBlank(user.firstName) ? "نام کاربر نمی‌تواند خالی باشد." : ""}
                error={!isNotBlank(user.firstName)}
            />
            <CustomTextField
                required
                label="نام خانوادگی"
                value={user.lastName}
                onChange={(e) =>
                    setUser({...user, lastName: e.target.value})}
                helperText={!isNotBlank(user.lastName) ? "نام خانوادگی نمی‌تواند خالی باشد." : ""}
                error={!isNotBlank(user.lastName)}
            />
            <ComboBox
                options={PERSIAN_GENDERS}
                value={genderMapToPersian(user.personalInfo!.gender)}
                onChange={(e, newValue) =>
                    setUser(update(user, {
                        personalInfo: {
                            gender: () => genderMapToEnglish(newValue),
                        }
                    }))
                }
                inputProps={{
                    label: "جنسیت",
                }}
            />
            <CustomTextField
                textDirection={"ltr"}
                required
                label="شماره تلفن"
                value={user.personalInfo!.telephoneNumber}
                onChange={(e) => handlePhoneNumberChange(e)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">98+</InputAdornment>,
                }}
                helperText={!isTelephoneNumberValid(user.personalInfo!.telephoneNumber) ? "شماره تلفن معتبر نمی‌باشد." : ""}
                error={!isTelephoneNumberValid(user.personalInfo!.telephoneNumber)}
            />
            <CustomTextField
                textDirection={"ltr"}
                required
                label="آدرس ایمیل"
                value={user.personalInfo!.email}
                onChange={(e) =>
                    setUser(update(user, {
                        personalInfo: {
                            email: () => e.target.value,
                        }
                    }))
                }
                helperText={!isEmailValid(user.personalInfo!.email) ? "آدرس ایمیل معتبر نمی‌باشد." : ""}
                error={!isEmailValid(user.personalInfo!.email)}
            />
            <Typography className={commonClasses.title} variant="h6">
                حساب کاربری
            </Typography>
            <CustomTextField
                required
                label="نام کاربری"
                autoComplete="username"
                value={user.username}
                onChange={(e) =>
                    setUser({...user, username: e.target.value})}
                helperText={!isNotBlank(user.username) ? "نام کاربری معتبر نمی‌باشد." : ""}
                error={!isNotBlank(user.username)}
            />
            <PasswordTextField
                dir="rtl"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="رمز عبور"
                value={user.password}
                onChange={(e) =>
                    setUser({...user, password: e.target.value})}
                helperText={!isNotBlank(user.password!) ? "رمز عبور حساب کاربری معتبر نمی‌باشد." : ""}
                error={!isNotBlank(user.password!)}
            />
        </React.Fragment>
    );
}

export default SignUpGeneralInfo;