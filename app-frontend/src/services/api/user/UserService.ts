import update from "immutability-helper";
import apiAxios from "../../../config/axios-config";
import {Gender} from "../../../model/enum/gender";
import {Role} from "../../../model/enum/role";
import {User, UserCheck} from "../../../model/user/user";
import {validateEmail} from "../../../utility/email-utils";
import {API_USER_CHECK_AVAILABLE_SIGN_IN_NAMES_PATH} from "../../ApiPaths";

class UserService {

    private constructor() {
    }

    static createInitialUser(): User {
        return {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            role: Role.STUDENT,
            personalInfo: {
                gender: Gender.MALE,
                telephoneNumber: "",
                email: "",
            },
        }
    }

    static checkAvailableSignInNames(username: string) {
        return apiAxios.get<UserCheck>(API_USER_CHECK_AVAILABLE_SIGN_IN_NAMES_PATH,
            {
                validateStatus: status => status === 200,
                params: {
                    username: username,
                }
            })
    }

    static isUserValid(user: User) {
        return user.username.length > 0 &&
            user.password && UserService.isPasswordValid(user.password) &&
            user.firstName.length > 0 &&
            user.lastName.length > 0 &&
            user.personalInfo &&
            UserService.isTelephoneNumberValid(user.personalInfo.telephoneNumber) &&
            UserService.isEmailValid(user.personalInfo.email);
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

    static updatePhoneNumber(user: User, telephoneNumber: string) {
        return update(user, {personalInfo: {telephoneNumber: () => telephoneNumber}})
    }

    static isEmailValid(email: string) {
        return validateEmail(email)
    }
}

export default UserService;