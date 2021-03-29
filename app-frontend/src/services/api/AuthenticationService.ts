import {AxiosError} from "axios";
import {API_AUTHENTICATION_CREATE_PATH} from "../ApiPaths";
import history from "../../config/history";
import apiAxios from "../../config/axios-config";

export interface AuthenticationResponse {
    username: string,
    token?: string,
    error?: string
}

class AuthenticationService {
    private static authenticationKey = "auth"

    private constructor() {
    }

    static isAuthenticated() {
        return localStorage.getItem(AuthenticationService.authenticationKey) != null;
    }

    static getAuthenticationToken() {
        return localStorage.getItem(AuthenticationService.authenticationKey);
    }

    static clearAuthentication() {
        localStorage.removeItem(AuthenticationService.authenticationKey);
    }

    static authenticate(username: string, password: string) {
        apiAxios.post<AuthenticationResponse>(API_AUTHENTICATION_CREATE_PATH, {
            username: username,
            password: password
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem(AuthenticationService.authenticationKey, response.data.token!);
                history.push("/dashboard");
            } else {
                throw new Error(`Receive a response from authentication endpoint in range 2xx which is not ok: 
                    status = ${response.status} response = ${response}`);
            }
        }).catch((reason: AxiosError) => {
            // TODO: Show a error notification
            console.error(`Unhandled exception: ${reason}`);
        });
    }
}

export default AuthenticationService;