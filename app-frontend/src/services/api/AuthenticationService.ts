import {AxiosError} from "axios";
import jwtDecode from "jwt-decode";
import apiAxios from "../../config/axios-config";
import browserHistory from "../../config/browserHistory";
import {CustomJwtPayload, TokenType} from "../../model/auth/jwtToken";
import {DASHBOARD_VIEW_PATH, LOGIN_VIEW_PATH} from "../../views/ViewPaths";
import {
    API_AUTHENTICATION_CHECK_PATH,
    API_AUTHENTICATION_DOWNLOAD_TOKEN_PATH,
    API_AUTHENTICATION_LOGIN_PATH,
    API_AUTHENTICATION_REFRESH_PATH
} from "../ApiPaths";

export interface AuthResponse {
    token: string,
    refreshToken?: string,
}

class AuthenticationService {

    private constructor() {
    }

    static isAuthenticated() {
        return localStorage.getItem(TokenType.ACCESS) != null;
    }

    static logout() {
        localStorage.removeItem(TokenType.ACCESS);
        localStorage.removeItem(TokenType.REFRESH);
        browserHistory.push(LOGIN_VIEW_PATH);
    }

    static getAccessToken() {
        return localStorage.getItem(TokenType.ACCESS);
    }

    static getRefreshToken() {
        return localStorage.getItem(TokenType.REFRESH);
    }

    static async login(username: string, password: string): Promise<AxiosError | void> {
        const response = await apiAxios.post<AuthResponse>(API_AUTHENTICATION_LOGIN_PATH,
            {
                username: username,
                password: password
            })
        localStorage.setItem(TokenType.ACCESS, response.data.token);
        localStorage.setItem(TokenType.REFRESH, response.data.refreshToken!);
        browserHistory.push(DASHBOARD_VIEW_PATH);
    }

    static async refresh() {
        const response = await apiAxios.post<AuthResponse>(API_AUTHENTICATION_REFRESH_PATH,
            {
                refresh_token: AuthenticationService.getRefreshToken()
            })
        localStorage.setItem(TokenType.ACCESS, response.data.token);
    }

    static getDownloadToken() {
        return apiAxios
            .get<AuthResponse>(API_AUTHENTICATION_DOWNLOAD_TOKEN_PATH)
            .then(response => response.data);
    }

    static check() {
        return apiAxios.get<{}>(API_AUTHENTICATION_CHECK_PATH)
    }

    static getJwtPayloadUserId() {
        return AuthenticationService.getJwtPayload()?.userId;
    }

    static getJwtPayloadRole() {
        return AuthenticationService.getJwtPayload()?.role;
    }

    public static getJwtPayload() {
        const accessToken = AuthenticationService.getAccessToken();
        if (accessToken) {
            return jwtDecode<CustomJwtPayload>(accessToken);
        }
    }
}

export default AuthenticationService;