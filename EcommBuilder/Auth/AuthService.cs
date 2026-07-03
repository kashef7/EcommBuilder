using EcommBuilder.DataBase;
using Microsoft.EntityFrameworkCore;

namespace EcommBuilder.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context) => _context = context;
    
    public async Task<SignedInUserDto> HandleGoogleUser(GoogleUserDto googleUserDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Provider == googleUserDto.Provider && 
                u.ProviderId == googleUserDto.ProviderId);
        if (user != null)
        {
            return new SignedInUserDto(user.UserId,user.UserName,user.Email);
        }

        var newUser = new Users
        {
            UserId = Guid.NewGuid(),
            UserName = googleUserDto.UserName,
            Email = googleUserDto.Email,
            Provider = googleUserDto.Provider,
            ProviderId =  googleUserDto.ProviderId
        };
        
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return new SignedInUserDto(newUser.UserId,newUser.UserName, newUser.Email);
    }
}