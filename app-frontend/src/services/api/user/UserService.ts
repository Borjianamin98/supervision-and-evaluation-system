import {Gender} from "../../../model/enum/gender";
import {User} from "../../../model/user/user";
import {validateEmail} from "../../../utility/email-utils";

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
                gender: Gender.MALE,
                telephoneNumber: "",
                email: "",
            },
        }
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

    static isEmailValid(email: string) {
        return validateEmail(email)
    }
}

export default UserService;