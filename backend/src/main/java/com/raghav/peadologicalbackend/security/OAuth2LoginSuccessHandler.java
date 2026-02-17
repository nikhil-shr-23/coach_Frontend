package com.raghav.peadologicalbackend.security;

import com.raghav.peadologicalbackend.entity.Roles;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.repository.UserRepository;
import com.raghav.peadologicalbackend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        if(email == null) {
            // Attempt to get user principal name if email is missing (common with Microsoft accounts)
             email = oAuth2User.getAttribute("userPrincipalName");
        }

        if (email == null) {
            String errorMessage = "Email not found from OAuth provider";
            try {
                errorMessage = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8.toString());
            } catch (UnsupportedEncodingException e) {
                // Should not happen for UTF-8
            }
             response.sendRedirect("http://localhost:3000/auth/error?message=" + errorMessage);
             return;
        }

        String finalEmail = email;
        Users user = userRepository.findByEmail(email).orElseGet(() -> {
            Users newUser = new Users();
            newUser.setEmail(finalEmail);
            newUser.setUsername(finalEmail);
            String name = oAuth2User.getAttribute("name");
            newUser.setName(name != null ? name : finalEmail);
            newUser.setRoles(Roles.TEACHER); // Default role
            newUser.setPassword(UUID.randomUUID().toString()); // Random password
            return userRepository.save(newUser);
        });

        String token = jwtService.genrateToken(user.getUsername(), user.getRoles().name());

        response.sendRedirect("http://localhost:3000/auth/success?token=" + token);
    }
}
