import apiAxios from "../../config/axios-config";
import {User} from "../../model/user";
import {API_USER_RETRIEVE_MASTERS_PATH} from "../ApiPaths";

class UserService {

    private constructor() {
    }

    static retrieveMasterUsers() {
        return apiAxios.get<Array<User>>(API_USER_RETRIEVE_MASTERS_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default UserService;