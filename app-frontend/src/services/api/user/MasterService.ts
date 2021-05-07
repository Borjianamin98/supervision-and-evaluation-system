import apiAxios from "../../../config/axios-config";
import {Master, MasterRegister} from "../../../model/user/master";
import {API_MASTER_INFO_PATH, API_MASTER_PATH, API_MASTER_REGISTER_PATH} from "../../ApiPaths";

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
        return apiAxios.get<Array<Master>>(API_MASTER_PATH,
            {
                validateStatus: status => status === 200
            })
    }

    static retrieveMasterInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Master>(API_MASTER_INFO_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default MasterService;