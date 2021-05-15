import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {Master, MasterRegister} from "../../../model/user/master";
import {
    API_MASTER_INFO_PATH,
    API_MASTER_PATH,
    API_MASTER_REGISTER_PATH,
    API_PROBLEM_MASTER_UPDATE_REFEREES_PATH
} from "../../ApiPaths";

class MasterService {

    private constructor() {
    }

    static registerMaster(masterRegister: MasterRegister) {
        return apiAxios.post<Master>(API_MASTER_REGISTER_PATH, masterRegister)
    }

    static retrieveMasters(pageSize: number, page: number, nameQuery?: string) {
        return apiAxios.get<Pageable<Master>>(API_MASTER_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery,
                }
            }).then(response => response.data);
    }

    static updateReferees(problemId: number, referees: Master[]) {
        return apiAxios.post<Problem>(
            API_PROBLEM_MASTER_UPDATE_REFEREES_PATH.replace("{0}", String(problemId)),
            referees.map(referee => referee.id!)).then(response => response.data);
    }

    static retrieveMasterInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Master>(API_MASTER_INFO_PATH)
    }
}

export default MasterService;