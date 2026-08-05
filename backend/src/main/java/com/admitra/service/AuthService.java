package com.admitra.service;

import com.admitra.dto.JwtAuthResponse;
import com.admitra.dto.LoginRequest;
import com.admitra.dto.RegisterRequest;
import com.admitra.entity.RefreshToken;
import com.admitra.entity.Role;
import com.admitra.entity.RoleName;
import com.admitra.entity.User;
import com.admitra.exception.BadRequestException;
import com.admitra.repository.RefreshTokenRepository;
import com.admitra.repository.RoleRepository;
import com.admitra.repository.UserRepository;
import com.admitra.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        RoleName roleName = "ADMIN".equalsIgnoreCase(registerRequest.getRole()) ? RoleName.ROLE_ADMIN : RoleName.ROLE_ADVERTISER;
        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("User Role not set."));

        user.setRole(userRole);
        userRepository.save(user);
    }

    public JwtAuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        RefreshToken refreshToken = createRefreshToken(user);

        return new JwtAuthResponse(jwt, refreshToken.getToken());
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(86400000)); // 24 hours
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public JwtAuthResponse refreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
            .map(this::verifyExpiration)
            .map(RefreshToken::getUser)
            .map(user -> {
                String jwt = tokenProvider.generateTokenFromEmail(user.getEmail());
                return new JwtAuthResponse(jwt, token);
            })
            .orElseThrow(() -> new BadRequestException("Refresh token is not in database!"));
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
}
