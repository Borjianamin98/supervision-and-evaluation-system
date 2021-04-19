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
import ir.ac.sbu.evaluation.exception.InvalidJwtTokenException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final static String TOKEN_TYPE_CLAIM_NAME = "token-type";
    private final static String ACCESS_TOKEN_TYPE_NAME = "access-token";
    private final static String REFRESH_TOKEN_TYPE_NAME = "refresh-token";
    private final static String TOKEN_USER_ID_CLAIM_NAME = "user-id";
    private final static String TOKEN_ROLES_CLAIM_NAME = "roles";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration-seconds}")
    private long jwtAccessTokenExpirationSeconds;

    @Value("${jwt.refresh-token-expiration-seconds}")
    private long jwtRefreshTokenExpirationSeconds;

    public Claims parseToken(String token) throws InvalidJwtTokenException {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes(StandardCharsets.UTF_8))
                    .parseClaimsJws(token);
            ensureCustomClaims(jws);
            return jws.getBody();
        } catch (UnsupportedJwtException e) {
            throw new InvalidJwtTokenException("Received unsupported JWT in a particular format/configuration.", e);
        } catch (MalformedJwtException e) {
            throw new InvalidJwtTokenException("Received invalid JWT string.", e);
        } catch (SignatureException e) {
            throw new InvalidJwtTokenException("Received JWT not match with signature.", e);
        } catch (ExpiredJwtException e) {
            throw new InvalidJwtTokenException("Received expired JWT token.", e);
        } catch (IllegalArgumentException e) {
            throw new AssertionError("Received unexpected empty JWT string.", e);
        }
    }

    private void ensureCustomClaims(Jws<Claims> jws) throws InvalidJwtTokenException {
        List<String> customDefinedClaims = Arrays.asList(TOKEN_ROLES_CLAIM_NAME, TOKEN_ROLES_CLAIM_NAME);
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

    public List<String> getRoles(Claims tokenClaims) {
        try {
            @SuppressWarnings("unchecked")
            List<String> result = tokenClaims.get(TOKEN_ROLES_CLAIM_NAME, List.class);
            return result;
        } catch (ClassCastException e) {
            throw new AssertionError("Unexpected exception while extracting roles from a validated token", e);
        }
    }

    public String generateRefreshToken(AuthUserDetail authUserDetail) {
        return generateToken(authUserDetail, REFRESH_TOKEN_TYPE_NAME);
    }

    public String generateAccessToken(AuthUserDetail authUserDetail) {
        return generateToken(authUserDetail, ACCESS_TOKEN_TYPE_NAME);
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
     *     <li>user-id: {@code userId}</li>
     *     <li>roles: roles</li>
     *     <li>token-type: {@code tokenType}</li>
     *     <li>issue-at: current time</li>
     *     <li>expiration: current time + expirationOffset</li>
     * </ul>
     *
     * @return generate token based on give configurations
     */
    private String generateToken(AuthUserDetail authUserDetail, String tokenType) {
        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put(TOKEN_TYPE_CLAIM_NAME, tokenType);
        customClaims.put(TOKEN_ROLES_CLAIM_NAME,
                authUserDetail.getAuthorities().stream().map(Object::toString).collect(Collectors.toList()));
        customClaims.put(TOKEN_USER_ID_CLAIM_NAME, authUserDetail.getUserId());

        long currentTime = System.currentTimeMillis();
        long expirationOffset = tokenType.equals(ACCESS_TOKEN_TYPE_NAME) ?
                jwtAccessTokenExpirationSeconds : jwtRefreshTokenExpirationSeconds;

        return Jwts.builder()
                .setClaims(customClaims)
                .setSubject(authUserDetail.getUsername())
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(currentTime + expirationOffset * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes(StandardCharsets.UTF_8))
                .compact();
    }
}