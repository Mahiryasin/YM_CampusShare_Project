package com.ym_project.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.ym_project.DTO.LoginResponse;
import com.ym_project.DTO.RefreshTokenRequest;
import com.ym_project.Entity.RefreshToken;
import com.ym_project.Entity.UserCredentials;
import com.ym_project.RefreshTokenReporistory.IRefreshTokenReporistory;
import com.ym_project.SecurityService.JwtTokenProvider;
import com.ym_project.SecurityService.MyUserDetails;
import com.ym_project.SecurityService.UserDetailService;
import com.ym_project.UserReporistory.IUserCredentialsRepository;

@Service
public class RefreshTokenService {

    private final IRefreshTokenReporistory refreshTokenReporistory;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserService userService;

    private final IUserCredentialsRepository userCredentials;
    
    private final UserDetailService userDetailService;


    
     public RefreshTokenService(IRefreshTokenReporistory refreshTokenReporistory,JwtTokenProvider jwtTokenProvider,UserDetailService userDetailService,UserService userService,IUserCredentialsRepository userCredentials){
        this.refreshTokenReporistory=refreshTokenReporistory;
        this.jwtTokenProvider=jwtTokenProvider;
        this.userDetailService=userDetailService;
        this.userService=userService;
        this.userCredentials=userCredentials;
     }



       public LoginResponse refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
            RefreshToken refresh_token_response=isValidToken(refreshTokenRequest.getRefreshToken());
            UserDetails userDetails= userDetailService.loadUserByUsername(refresh_token_response.getEmail());
            Authentication authentication=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

            Optional<UserCredentials> userCredentials_=userCredentials.findByEmail(refresh_token_response.getEmail());
            return GeneratePairToken(authentication, userDetails,userCredentials_.get().getUserProfile().getId());
            
 }



       public LoginResponse GeneratePairToken(Authentication authentication,UserDetails userDetails, Long userId){
        
          String AuthToken=jwtTokenProvider.GenerateToken(authentication);
          String Refresh_token=userService.GenerateToken(userDetails.getUsername());
          return new LoginResponse(AuthToken, Refresh_token, userDetails.getUsername(), userId);

       }



       private RefreshToken isValidToken(String RefreshToken) {
          RefreshToken refreshToken_Entity=refreshTokenReporistory.findRefreshTokenFromToken(RefreshToken);
          
          if(refreshToken_Entity == null) {
              throw new com.ym_project.ExceptionHandler.BaseException(new com.ym_project.ExceptionHandler.ErrorResponse(com.ym_project.ExceptionHandler.ERROR.NOT_FOUND.getError_message(), com.ym_project.ExceptionHandler.ERROR.NOT_FOUND.getStatus()));
          }

          LocalDate now=LocalDate.now();
          if(refreshToken_Entity.isIssued() || now.isAfter(refreshToken_Entity.getExpireDate())){
             refreshTokenReporistory.DeletepastToken(RefreshToken);
             throw new com.ym_project.ExceptionHandler.BaseException(new com.ym_project.ExceptionHandler.ErrorResponse(com.ym_project.ExceptionHandler.ERROR.TOKEN_EXPIRED.getError_message(), com.ym_project.ExceptionHandler.ERROR.TOKEN_EXPIRED.getStatus()));
          }
          refreshToken_Entity.setIssued(true);
          refreshTokenReporistory.save(refreshToken_Entity);
          return refreshToken_Entity;
          
}

}
