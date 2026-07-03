namespace EcommBuilder.Auth;

public interface IAuthService
{
    public  Task<SignedInUserDto> HandleGoogleUser(GoogleUserDto googleUserDto);
}