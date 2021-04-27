import apiAxios from "../../config/axios-config";
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
            university: "",
        }
    }

    static isTelephoneNumberValid(telephoneNumber: string) {
        return telephoneNumber.length === 10;
    }

    static isEmailValid(email: string) {
        return validateEmail(email)
    }

    static retrieveMasterUsers() {
        return apiAxios.get<Array<User>>(API_USER_RETRIEVE_MASTERS_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default UserService;