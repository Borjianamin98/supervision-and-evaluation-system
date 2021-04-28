import apiAxios from "../../../config/axios-config";
import {Master, MasterRegister} from "../../../model/user/master";
import {User} from "../../../model/user/user";
import {API_MASTER_PATH, API_MASTER_REGISTER_PATH} from "../../ApiPaths";

class MasterService {

    private constructor() {
    }

    static registerMaster(masterRegister: MasterRegister) {
        return apiAxios.post<Master>(API_MASTER_REGISTER_PATH, masterRegister,
            {
                validateStatus: status => status === 200
            })
    }

    static retrieveMasterUsers() {
        return apiAxios.get<Array<User>>(API_MASTER_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default MasterService;