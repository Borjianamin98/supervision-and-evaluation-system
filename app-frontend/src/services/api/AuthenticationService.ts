import {AxiosError} from "axios";
import {API_AUTHENTICATION_LOGIN_PATH, API_AUTHENTICATION_REFRESH_PATH} from "../ApiPaths";
import browserHistory from "../../config/browserHistory";
import apiAxios from "../../config/axios-config";

export interface AuthResponse {
    username: string,
    access_token?: string,
    refresh_token?: string,
    error?: string
}

class AuthenticationService {
    private static readonly AUTH_ACCESS_TOKEN_KEY = "auth-access"
    private static readonly AUTH_REFRESH_TOKEN_KEY = "auth-refresh"

    private constructor() {
    }

    static isAuthenticated() {
        return localStorage.getItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY) != null;
    }

    static logout() {
        localStorage.removeItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY);
        localStorage.removeItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY);
        browserHistory.push("/login");
    }

    static getAccessToken() {
        return localStorage.getItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY);
    }

    static getRefreshToken() {
        return localStorage.getItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY);
    }

    static login(username: string, password: string) {
        apiAxios.post<AuthResponse>(API_AUTHENTICATION_LOGIN_PATH, {
            username: username,
            password: password
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY, response.data.access_token!);
                localStorage.setItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY, response.data.refresh_token!);
                browserHistory.push("/dashboard");
            } else {
                throw new Error(`Receive a response from auth endpoint in range 2xx which is not ok: 
                    status = ${response.status} response = ${response}`);
            }
        }).catch((reason: AxiosError) => {
            // TODO: Show a error notification
            console.error(`Unhandled exception: ${reason}`);
        });
    }

    static async refresh() {
        const response = await apiAxios.post<AuthResponse>(API_AUTHENTICATION_REFRESH_PATH, {
            refresh_token: AuthenticationService.getRefreshToken()
        })
        if (response.status === 200) {
            localStorage.setItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY, response.data.access_token!);
        } else {
            throw new Error(`Receive a response from auth endpoint in range 2xx which is not ok: 
                status = ${response.status} response = ${response}`);
        }
    }
}

export default AuthenticationService;