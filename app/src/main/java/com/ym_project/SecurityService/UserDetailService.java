package com.ym_project.SecurityService;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ym_project.Entity.UserCredentials;
import com.ym_project.ExceptionHandler.ERROR;
import com.ym_project.ExceptionHandler.ErrorResponse;
import com.ym_project.UserReporistory.IUserCredentialsRepository;

@Component
public class UserDetailService implements UserDetailsService {

    private final IUserCredentialsRepository userCredentialsRepository;

    private final MyUserDetails myUserDetails;

    public UserDetailService(IUserCredentialsRepository userCredentialsRepository, MyUserDetails myUserDetails) {
        this.userCredentialsRepository = userCredentialsRepository;
        this.myUserDetails = myUserDetails;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserCredentials userCredentials = userCredentialsRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        new ErrorResponse(ERROR.NOT_FOUND.getError_message(), ERROR.NOT_FOUND.getStatus())
                                .CreateErrorResponse()
                ));

        return myUserDetails.createUser(userCredentials);
    }

}
