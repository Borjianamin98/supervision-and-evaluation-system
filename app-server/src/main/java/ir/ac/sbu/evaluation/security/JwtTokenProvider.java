package ir.ac.sbu.evaluation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.IncorrectClaimException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.MissingClaimException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import ir.ac.sbu.evaluation.exception.security.InvalidJwtTokenException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final static String TOKEN_TYPE_CLAIM_NAME = "tokenType";
    private final static String ACCESS_TOKEN_TYPE_NAME = "accessToken";
    private final static String REFRESH_TOKEN_TYPE_NAME = "refreshToken";
    private final static String DOWNLOAD_TOKEN_TYPE_NAME = "downloadToken";

    private final static String TOKEN_USER_ID_CLAIM_NAME = "userId";
    private final static String TOKEN_FULL_NAME_CLAIM_NAME = "fullName";
    private final static String TOKEN_ROLE_CLAIM_NAME = "role";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration-seconds}")
    private long jwtAccessTokenExpirationSeconds;

    @Value("${jwt.refresh-token-expiration-seconds}")
    private long jwtRefreshTokenExpirationSeconds;

    @Value("${jwt.download-token-expiration-seconds}")
    private long jwtDownloadTokenExpirationSeconds;

    public Claims parseToken(String token) throws InvalidJwtTokenException {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                    .parseClaimsJws(token);
            ensureCustomClaims(jws);
            return jws.getBody();
        } catch (UnsupportedJwtException e) {
            throw new InvalidJwtTokenException("Received unsupported JWT in a particular format/configuration", e);
        } catch (MalformedJwtException e) {
            throw new InvalidJwtTokenException("Received invalid JWT string", e);
        } catch (SignatureException e) {
            throw new InvalidJwtTokenException("Received JWT not match with signature", e);
        } catch (ExpiredJwtException e) {
            throw new InvalidJwtTokenException("Received expired JWT token", e);
        } catch (IllegalArgumentException e) {
            throw new AssertionError("Received unexpected empty JWT string", e);
        }
    }

    private void ensureCustomClaims(Jws<Claims> jws) throws InvalidJwtTokenException {
        List<String> customDefinedClaims = Arrays.asList(TOKEN_TYPE_CLAIM_NAME,
                TOKEN_USER_ID_CLAIM_NAME,
                TOKEN_FULL_NAME_CLAIM_NAME,
                TOKEN_ROLE_CLAIM_NAME);
        for (String customDefinedClaim : customDefinedClaims) {
            if (!jws.getBody().containsKey(customDefinedClaim)) {
                throw new InvalidJwtTokenException(new MissingClaimException(jws.getHeader(), jws.getBody(),
                        "Received JWT which do not contain custom defined claims: " + customDefinedClaim));
            }
        }
    }

    public String getUsername(Claims tokenClaims) {
        return tokenClaims.getSubject();
    }

    public long getUserId(Claims tokenClaims) {
        return tokenClaims.get(TOKEN_USER_ID_CLAIM_NAME, Long.class);
    }

    public String getFullName(Claims tokenClaims) {
        return tokenClaims.get(TOKEN_FULL_NAME_CLAIM_NAME, String.class);
    }

    public String getRole(Claims tokenClaims) {
        return tokenClaims.get(TOKEN_ROLE_CLAIM_NAME, String.class);
    }

    public String generateRefreshToken(AuthUserDetail authUserDetail) {
        return generateToken(authUserDetail, REFRESH_TOKEN_TYPE_NAME);
    }

    public String generateAccessToken(AuthUserDetail authUserDetail) {
        return generateToken(authUserDetail, ACCESS_TOKEN_TYPE_NAME);
    }

    public String generateDownloadToken(AuthUserDetail authUserDetail) {
        return generateToken(authUserDetail, DOWNLOAD_TOKEN_TYPE_NAME);
    }

    public void ensureIsDownloadToken(Claims tokenClaims) throws InvalidJwtTokenException {
        ensureTokenType(tokenClaims, DOWNLOAD_TOKEN_TYPE_NAME);
    }

    public void ensureIsAccessToken(Claims tokenClaims) throws InvalidJwtTokenException {
        ensureTokenType(tokenClaims, ACCESS_TOKEN_TYPE_NAME);
    }

    public void ensureIsRefreshToken(Claims tokenClaims) throws InvalidJwtTokenException {
        ensureTokenType(tokenClaims, REFRESH_TOKEN_TYPE_NAME);
    }

    private void ensureTokenType(Claims tokenClaims, String requiredTokenType) throws InvalidJwtTokenException {
        String tokenType = tokenClaims.get(TOKEN_TYPE_CLAIM_NAME, String.class);
        if (!tokenType.equals(requiredTokenType)) {
            throw new InvalidJwtTokenException(new IncorrectClaimException(null, tokenClaims,
                    String.format("Expected claims was incorrect in JWT token: %s should be %s but was %s",
                            TOKEN_TYPE_CLAIM_NAME, requiredTokenType, tokenType)));
        }
    }

    /**
     * Generate a JWT token with below defined structure:
     * <ul>
     *     <li>subject: {@code username}</li>
     *     <li>userId: {@code userId}</li>
     *     <li>fullName: user full name</li>
     *     <li>role: role</li>
     *     <li>tokenType: {@code tokenType}</li>
     *     <li>issue at: current time</li>
     *     <li>expiration: current time + expirationOffset</li>
     * </ul>
     *
     * @return generate token based on give configurations
     */
    private String generateToken(AuthUserDetail authUserDetail, String tokenType) {
        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put(TOKEN_TYPE_CLAIM_NAME, tokenType);
        customClaims.put(TOKEN_ROLE_CLAIM_NAME, authUserDetail.getRole());
        customClaims.put(TOKEN_USER_ID_CLAIM_NAME, authUserDetail.getUserId());
        customClaims.put(TOKEN_FULL_NAME_CLAIM_NAME, authUserDetail.getFullName());

        long currentTime = System.currentTimeMillis();
        long expirationOffset;
        switch (tokenType) {
            case ACCESS_TOKEN_TYPE_NAME:
                expirationOffset = jwtAccessTokenExpirationSeconds;
                break;
            case REFRESH_TOKEN_TYPE_NAME:
                expirationOffset = jwtRefreshTokenExpirationSeconds;
                break;
            case DOWNLOAD_TOKEN_TYPE_NAME:
                expirationOffset = jwtDownloadTokenExpirationSeconds;
                break;
            default:
                throw new AssertionError("Invalid token type requested: " + tokenType);
        }

        return Jwts.builder()
                .setClaims(customClaims)
                .setSubject(authUserDetail.getUsername())
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(currentTime + expirationOffset * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes(StandardCharsets.UTF_8))
                .compact();
    }
}