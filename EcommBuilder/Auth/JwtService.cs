using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace EcommBuilder.Auth;

public interface IJwtService
{
    string GenerateToken(Guid userId, string userName, string email);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    public JwtService(IConfiguration config) => _config = config;

    public string GenerateToken(Guid userId, string userName, string email)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),  // userId
            new Claim(ClaimTypes.Name, userName),                      // name
            new Claim(ClaimTypes.Email, email)                         // email
        };

        var token = new JwtSecurityToken(
            issuer:            _config["Jwt:Issuer"],
            audience:          _config["Jwt:Audience"],
            claims:            claims,
            expires:           DateTime.UtcNow.AddDays(
                int.Parse(_config["Jwt:ExpiryDays"]!)),
            signingCredentials: new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}