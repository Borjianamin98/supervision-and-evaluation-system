import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/api/Pageable";
import {Master} from "../../../model/user/master/Master";
import {MasterSave} from "../../../model/user/master/MasterSave";

class MasterService {

    private static readonly API_MASTER_ROOT_PATH = "/master"
    private static readonly API_MASTER_REGISTER_PATH = `${MasterService.API_MASTER_ROOT_PATH}/register`

    private constructor() {
    }

    static register(masterSave: MasterSave) {
        return apiAxios.post<Master>(MasterService.API_MASTER_REGISTER_PATH, masterSave)
            .then(response => response.data);
    }

    static retrieveMasters(pageSize: number, page: number, nameQuery?: string) {
        return apiAxios
            .get<Pageable<Master>>(MasterService.API_MASTER_ROOT_PATH,
                {
                    params: {
                        size: pageSize,
                        page: page,
                        nameQuery: nameQuery,
                    }
                })
            .then(response => response.data);
    }

    static retrieveAuthenticatedMaster() {
        // Returns authenticated master user information
        return apiAxios
            .get<Master>(`${MasterService.API_MASTER_ROOT_PATH}/authenticated`)
            .then(response => response.data);
    }

    static retrieveMaster(masterId: number) {
        return apiAxios
            .get<Master>(`${MasterService.API_MASTER_ROOT_PATH}/${masterId}`)
            .then(response => response.data)
    }
}

export default MasterService;