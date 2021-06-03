import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Master, MasterRegister} from "../../../model/user/master";

class MasterService {

    private static readonly API_MASTER_ROOT_PATH = "/master"
    private static readonly API_MASTER_REGISTER_PATH = `${MasterService.API_MASTER_ROOT_PATH}/register`
    private static readonly API_MASTER_INFO_PATH = `${MasterService.API_MASTER_ROOT_PATH}/info`

    private constructor() {
    }

    static registerMaster(masterRegister: MasterRegister) {
        return apiAxios.post<Master>(MasterService.API_MASTER_REGISTER_PATH, masterRegister)
    }

    static retrieveMasters(pageSize: number, page: number, nameQuery?: string) {
        return apiAxios.get<Pageable<Master>>(MasterService.API_MASTER_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery,
                }
            }).then(response => response.data);
    }

    static retrieveMasterInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Master>(MasterService.API_MASTER_INFO_PATH)
    }
}

export default MasterService;