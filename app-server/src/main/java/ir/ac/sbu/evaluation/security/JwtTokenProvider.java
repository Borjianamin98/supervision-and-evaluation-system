package ir.ac.sbu.evaluation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import ir.ac.sbu.evaluation.exception.InvalidJwtTokenException;
import java.util.Date;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-seconds}")
    private long jwtExpirationSeconds;

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) throws InvalidJwtTokenException {
        try {
            return claimsResolver.apply(Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody());
        } catch (UnsupportedJwtException e) {
            throw new InvalidJwtTokenException("Received unsupported JWT in a particular format/configuration.", e);
        } catch (MalformedJwtException e) {
            throw new InvalidJwtTokenException("Received invalid JWT string.", e);
        } catch (SignatureException e) {
            throw new InvalidJwtTokenException("Received JWT not match with signature.", e);
        } catch (ExpiredJwtException e) {
            throw new InvalidJwtTokenException("Received expired JWT token.", e);
        } catch (IllegalArgumentException e) {
            throw new InvalidJwtTokenException("Received empty JWT string.", e);
        }
    }

    public String getSubjectFromToken(String token) throws InvalidJwtTokenException {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public String generateToken(String subject) {
        long currentTime = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(currentTime + jwtExpirationSeconds * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}