package com.ym_project.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ym_project.DTO.LoginRequest;
import com.ym_project.DTO.LoginResponse;
import com.ym_project.DTO.RegisterRequest;
import com.ym_project.DTO.UserProfileResponse;
import com.ym_project.Entity.RefreshToken;
import com.ym_project.Entity.Role;
import com.ym_project.Entity.UserCredentials;
import com.ym_project.Entity.UserProfile;
import com.ym_project.ExceptionHandler.BaseException;
import com.ym_project.ExceptionHandler.ERROR;
import com.ym_project.ExceptionHandler.ErrorResponse;
import com.ym_project.Mapper.MapperClass;
import com.ym_project.RefreshTokenReporistory.IRefreshTokenReporistory;
import com.ym_project.SecurityService.JwtTokenProvider;
import com.ym_project.SecurityService.UserDetailService;
import com.ym_project.UserReporistory.IUserCredentialsRepository;
import com.ym_project.UserReporistory.IUserReporistory;
import com.ym_project.UserReporistory.IPasswordResetTokenRepository;
import com.ym_project.Entity.PasswordResetToken;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final IUserReporistory userReporistory;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final MapperClass mapperClass;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final IUserCredentialsRepository userCredentialsRepository;
    private final UserDetailService userDetailService;
    private final IRefreshTokenReporistory refreshTokenReporistory;
    private final IPasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public UserService(IUserReporistory userReporistory,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       MapperClass mapperClass,
                       BCryptPasswordEncoder bCryptPasswordEncoder,
                       IUserCredentialsRepository credentialsRepository,
                       UserDetailService userDetailService,
                       IRefreshTokenReporistory refreshTokenReporistory,
                       IPasswordResetTokenRepository passwordResetTokenRepository,
                       EmailService emailService) {
        this.userReporistory = userReporistory;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.mapperClass = mapperClass;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userCredentialsRepository = credentialsRepository;
        this.userDetailService = userDetailService;
        this.refreshTokenReporistory = refreshTokenReporistory;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public UserProfileResponse register(RegisterRequest request) {

        // loadUserByUsername exception fırlatır, bu yüzden repo'ya existsByEmail yazıp kontrol ediyoruz
        if (userCredentialsRepository.existsByEmail(request.getEmail())) {
            throw new BaseException(new ErrorResponse(ERROR.EMAIL_ALREADY_EXISTS.getError_message(), ERROR.EMAIL_ALREADY_EXISTS.getStatus()));
        }

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setEmail(request.getEmail());
        userCredentials.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

        UserProfile userProfile = mapperClass.turnUserProfile(request);
        userProfile.setTrustScore(0);
        UserProfile saveUserProfile = userReporistory.save(userProfile);

        userCredentials.setRole(Role.USER);
        userCredentials.setUserProfile(saveUserProfile);
        userCredentialsRepository.save(userCredentials);

        return mapperClass.userProfileResponse(saveUserProfile);
    }

    public LoginResponse login(LoginRequest request) {

        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(token);

            String jwtToken = jwtTokenProvider.GenerateToken(authentication);
            String RefreshToken=GenerateToken(request.getEmail());



            UserCredentials userCredentials = userCredentialsRepository
                    .findByEmail(request.getEmail())
                    .orElseThrow(() -> new BaseException(new ErrorResponse(ERROR.NOT_FOUND.getError_message(), ERROR.NOT_FOUND.getStatus())));

            return new LoginResponse(jwtToken,RefreshToken, request.getEmail(), userCredentials.getUserProfile().getId());

        } catch (org.springframework.security.core.AuthenticationException ex) {
            throw new BaseException(new ErrorResponse(ERROR.BAD_CREDENTIALS.getError_message(), ERROR.BAD_CREDENTIALS.getStatus()));
        } catch (BaseException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BaseException(new ErrorResponse(ERROR.GENERAL_ERROR.getError_message(), ERROR.GENERAL_ERROR.getStatus()));
        }
    }

    @Cacheable(value = "profile",key = "#id",unless = "#id == null")
    public UserProfileResponse getProfile(Long id) {
        UserProfile userProfile = userReporistory.findById(id)
                .orElseThrow(() -> new BaseException(new ErrorResponse(ERROR.NOT_FOUND.getError_message(), ERROR.NOT_FOUND.getStatus())));
        return mapperClass.userProfileResponse(userProfile);
    }

    public long getUserCount() {
        return userReporistory.count();
    }

    public void updateTrustScore(Long userId, Integer newScore) {
        UserProfile userProfile = userReporistory.findById(userId)
                .orElseThrow(() -> new BaseException(new ErrorResponse(ERROR.NOT_FOUND.getError_message(), ERROR.NOT_FOUND.getStatus())));
        userProfile.setTrustScore(newScore);
        userReporistory.save(userProfile);
    }

    // Token settings methods

    protected String GenerateToken(String email){
       refreshTokenReporistory.SetusedAllTokens(email);

       RefreshToken refreshToken=new RefreshToken();
       String Token=UUID.randomUUID()+" - "+ System.currentTimeMillis();

       LocalDate ExpireDate=LocalDate.now().plusDays(7);
    
       refreshToken.setEmail(email);
       refreshToken.setIssued(false);
       refreshToken.setExpireDate(ExpireDate);
       refreshToken.setToken(Token);
       refreshTokenReporistory.save(refreshToken);
       return Token;
    }

    @Transactional
    public void forgotPassword(String email) {
        if (!userCredentialsRepository.existsByEmail(email)) {
            throw new BaseException(new ErrorResponse("Bu e-posta adresiyle kayitli bir kullanici bulunamadi", 404));
        }

        // Clean up previous token if exists
        passwordResetTokenRepository.findByEmail(email).ifPresent(passwordResetTokenRepository::delete);

        // Generate 6-digit code (e.g. "048291")
        String token = String.format("%06d", (int) (Math.random() * 1000000));
        
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        passwordResetTokenRepository.save(resetToken);

        emailService.sendResetPasswordEmail(email, token);
    }

    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BaseException(ERROR.INVALID_TOKEN.toErrorResponse()));

        if (!resetToken.getEmail().equalsIgnoreCase(email)) {
            throw new BaseException(new ErrorResponse("Gecersiz dogrulama kodu", 400));
        }

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BaseException(ERROR.INVALID_TOKEN.toErrorResponse());
        }

        UserCredentials credentials = userCredentialsRepository.findByEmail(email)
                .orElseThrow(() -> new BaseException(ERROR.NOT_FOUND.toErrorResponse()));

        credentials.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userCredentialsRepository.save(credentials);

        passwordResetTokenRepository.delete(resetToken);
    }
}
