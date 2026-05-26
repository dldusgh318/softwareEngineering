package com.festivalapp.security;

import com.festivalapp.domain.auth.User;
import com.festivalapp.domain.auth.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  private final JwtProperties jwtProperties;
  private final SecretKey secretKey;

  public JwtTokenProvider(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    this.secretKey = Keys.hmacShaKeyFor(toSigningKey(jwtProperties.secret()));
  }

  public String createToken(User user) {
    Date now = new Date();
    Date expiresAt = new Date(now.getTime() + jwtProperties.expirationMillis());

    return Jwts.builder()
        .subject(user.id())
        .claim("email", user.email())
        .claim("role", user.role().name())
        .issuedAt(now)
        .expiration(expiresAt)
        .signWith(secretKey)
        .compact();
  }

  public AuthenticatedUser parseToken(String token) {
    Claims claims =
        Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return new AuthenticatedUser(
        claims.getSubject(),
        claims.get("email", String.class),
        parseRole(claims.get("role", String.class)));
  }

  private UserRole parseRole(String role) {
    if (role == null || role.isBlank()) {
      return UserRole.USER;
    }

    return UserRole.valueOf(role);
  }

  private byte[] toSigningKey(String secret) {
    byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);

    if (secretBytes.length >= 32) {
      return secretBytes;
    }

    try {
      return MessageDigest.getInstance("SHA-256").digest(secretBytes);
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException("SHA-256 알고리즘을 사용할 수 없습니다.", exception);
    }
  }
}
