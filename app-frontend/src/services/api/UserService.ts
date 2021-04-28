import apiAxios from "../../config/axios-config";
import {ENGLISH_GENDERS} from "../../model/enum/gender";
import {User} from "../../model/user/user";
import {validateEmail} from "../../utility/email-utils";
import {API_USER_RETRIEVE_MASTERS_PATH} from "../ApiPaths";

class UserService {

    private constructor() {
    }

    static createInitialUser(): User {
        return {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            personalInfo: {
                gender: "MALE",
                telephoneNumber: "",
                email: "",
            },
        }
    }

    static retrieveMasterUsers() {
        return apiAxios.get<Array<User>>(API_USER_RETRIEVE_MASTERS_PATH,
            {
                validateStatus: status => status === 200
            })
    }

    static isUserValid(user: User) {
        return user.username.length > 0 &&
            user.password && UserService.isPasswordValid(user.password) &&
            user.firstName.length > 0 &&
            user.lastName.length > 0 &&
            user.personalInfo &&
            UserService.isTelephoneNumberValid(user.personalInfo.telephoneNumber) &&
            UserService.isEmailValid(user.personalInfo.telephoneNumber) &&
            ENGLISH_GENDERS.includes(user.personalInfo.gender)
    }

    static isPasswordValid(password: string) {
        return password.length >= 8;
    }

    static isStudentNumberValid(studentNumber: string) {
        return studentNumber.replace(/[^0-9]/g, '') === studentNumber
            && studentNumber.length > 0;
    }

    static isTelephoneNumberValid(telephoneNumber: string) {
        return telephoneNumber.length === 10;
    }

    static isEmailValid(email: string) {
        return validateEmail(email)
    }
}

export default UserService;