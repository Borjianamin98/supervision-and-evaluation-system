import {Role} from "../enum/role";

// Same as JwtPayload but customized for our application
export interface CustomJwtPayload {
    sub: string, // username
    iat: number,
    exp: number,
    tokenType: TokenType,
    userId: number,
    fullName: string,
    role: Role,
}

export enum TokenType {
    ACCESS = "accessToken",
    REFRESH = "refreshToken"
}