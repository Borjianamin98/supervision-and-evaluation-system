import apiAxios from "../../../config/axios-config";
import {User} from "../../../model/user/user";
import {API_MASTER_PATH} from "../../ApiPaths";

class MasterService {

    private constructor() {
    }

    static retrieveMasterUsers() {
        return apiAxios.get<Array<User>>(API_MASTER_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default MasterService;