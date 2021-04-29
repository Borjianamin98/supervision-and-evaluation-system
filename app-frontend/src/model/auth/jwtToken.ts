import {Role} from "../enum/role";

// Same as JwtPayload but customized for our application
export interface CustomJwtPayload {
    sub: string, // username
    iat: number,
    exp: number,
    tokenType: TokenType,
    userId: number,
    roles: Role[],
}

enum TokenType {
    ACCESS = "accessToken",
    REFRESH = "refreshToken"
}