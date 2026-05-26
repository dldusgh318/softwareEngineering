package com.festivalapp.security;

import com.festivalapp.domain.auth.User;
import com.festivalapp.domain.auth.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  private final JwtProperties jwtProperties;
  private final SecretKey secretKey;

  public JwtTokenProvider(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
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
}
