import {AxiosError} from "axios";
import jwtDecode from "jwt-decode";
import apiAxios from "../../config/axios-config";
import browserHistory from "../../config/browserHistory";
import {CustomJwtPayload} from "../../model/auth/jwtToken";
import {DASHBOARD_VIEW_PATH, LOGIN_VIEW_PATH} from "../../views/ViewPaths";
import {API_AUTHENTICATION_LOGIN_PATH, API_AUTHENTICATION_REFRESH_PATH} from "../ApiPaths";

export interface AuthResponse {
    username: string,
    access_token?: string,
    refresh_token?: string,
    error?: string
}

class AuthenticationService {
    private static readonly AUTH_ACCESS_TOKEN_KEY = "authAccess"
    private static readonly AUTH_REFRESH_TOKEN_KEY = "authRefresh"

    private constructor() {
    }

    static isAuthenticated() {
        return localStorage.getItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY) != null;
    }

    static logout() {
        localStorage.removeItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY);
        localStorage.removeItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY);
        browserHistory.push(LOGIN_VIEW_PATH);
    }

    static getAccessToken() {
        return localStorage.getItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY);
    }

    static getRefreshToken() {
        return localStorage.getItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY);
    }

    static async login(username: string, password: string): Promise<AxiosError | void> {
        const response = await apiAxios.post<AuthResponse>(API_AUTHENTICATION_LOGIN_PATH,
            {
                username: username,
                password: password
            },
            {
                validateStatus: status => status === 200
            })
        localStorage.setItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY, response.data.access_token!);
        localStorage.setItem(AuthenticationService.AUTH_REFRESH_TOKEN_KEY, response.data.refresh_token!);
        browserHistory.push(DASHBOARD_VIEW_PATH);
    }

    static async refresh() {
        const response = await apiAxios.post<AuthResponse>(API_AUTHENTICATION_REFRESH_PATH,
            {
                refresh_token: AuthenticationService.getRefreshToken()
            },
            {
                validateStatus: status => status === 200
            })
        localStorage.setItem(AuthenticationService.AUTH_ACCESS_TOKEN_KEY, response.data.access_token!);
    }

    static getJwtPayloadRoles() {
        return AuthenticationService.getJwtPayload()?.roles;
    }

    private static getJwtPayload() {
        const accessToken = AuthenticationService.getAccessToken();
        if (accessToken) {
            return jwtDecode<CustomJwtPayload>(accessToken);
        }
    }
}

export default AuthenticationService;