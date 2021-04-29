import {Role} from "../enum/role";

// Same as JwtPayload but customized for our application
interface JwtToken {
    sub?: string,
    iat?: number,
    exp?: number,
    tokenType: "accessToken" | "refreshToken",
    roles: Role[]
}