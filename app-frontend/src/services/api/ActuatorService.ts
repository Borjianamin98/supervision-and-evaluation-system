import apiAxios from "../../config/axios-config";
import {API_ACTUATOR_HEALTH_PATH} from "../ApiPaths";

interface ActuatorHealthResponse {
    status: string
}

class ActuatorService {

    private constructor() {
    }

    static async isServerUp() {
        const response = await apiAxios.get<ActuatorHealthResponse>(API_ACTUATOR_HEALTH_PATH,
            {
                validateStatus: status => status === 200
            })
        return response.data.status === "UP";
    }
}

export default ActuatorService;