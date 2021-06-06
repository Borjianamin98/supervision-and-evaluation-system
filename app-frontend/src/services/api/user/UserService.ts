import update from "immutability-helper";
import apiAxios from "../../../config/axios-config";
import {Gender} from "../../../model/enum/gender";
import {UserCheck} from "../../../model/user/UserCheck";
import {UserSave} from "../../../model/user/UserSave";
import EmailUtils from "../../../utility/EmailUtils";

class UserService {

    private static readonly API_USER_ROOT_PATH = "/user"
    private static readonly API_USER_PROFILE_PICTURE_PATH = `${UserService.API_USER_ROOT_PATH}/profile/picture`
    private static readonly API_USER_CHECK_AVAILABLE_SIGN_IN_NAMES_PATH =
        `${UserService.API_USER_ROOT_PATH}/checkAvailableSignInNames`

    private constructor() {
    }

    static createInitialUserSave(): UserSave {
        return {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            personalInfo: {
                gender: Gender.MALE,
                telephoneNumber: "",
                email: "",
            },
        }
    }

    static checkAvailableSignInNames(username: string) {
        return apiAxios.get<UserCheck>(UserService.API_USER_CHECK_AVAILABLE_SIGN_IN_NAMES_PATH,
            {
                params: {
                    username: username,
                }
            })
    }

    static retrieveUserProfilePicture() {
        return apiAxios.get<Blob>(UserService.API_USER_PROFILE_PICTURE_PATH, {
            responseType: 'blob',
        })
    }

    static sendUserProfilePicture(formData: FormData) {
        return apiAxios.post<FormData>(UserService.API_USER_PROFILE_PICTURE_PATH, formData)
    }

    static isUserValid(userSave: UserSave) {
        return userSave.username.length > 0 &&
            userSave.password && UserService.isPasswordValid(userSave.password) &&
            userSave.firstName.length > 0 &&
            userSave.lastName.length > 0 &&
            userSave.personalInfo &&
            UserService.isTelephoneNumberValid(userSave.personalInfo.telephoneNumber) &&
            UserService.isEmailValid(userSave.personalInfo.email);
    }

    static isPasswordValid(password: string) {
        return password.length >= 8;
    }

    static isTelephoneNumberValid(telephoneNumber: string) {
        return telephoneNumber.length === 10;
    }

    static getPhoneNumberRepresentation = (phoneNumber: string) => {
        if (phoneNumber.length < 10) {
            return phoneNumber;
        } else if (phoneNumber.length === 10) {
            return phoneNumber.replace(
                /(\d{3})(\d{3})(\d{4})/,
                '$1 $2 $3'
            );
        } else {
            throw new Error(`Unexpected phone number: ${phoneNumber}`);
        }
    }

    static updatePhoneNumber(userSave: UserSave, telephoneNumber: string) {
        return update(userSave, {personalInfo: {telephoneNumber: () => telephoneNumber}})
    }

    static isEmailValid(email: string) {
        return EmailUtils.validateEmail(email)
    }
}

export default UserService;