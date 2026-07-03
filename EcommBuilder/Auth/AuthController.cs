using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommBuilder.Auth;

[ApiController] 
[Route("api/v1/auth")]
public class AuthController : Controller
{   
    IAuthService _authService;
    IJwtService _jwtService;
    public AuthController(IAuthService authService, IJwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }
    
    [HttpGet]
    public IActionResult Index()
    {
        return Ok(new { message = "Auth API is up and running" });
    }
    [HttpGet("google/login")]
    public async Task Login()
    {
        await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
    }
    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        
        if (!result.Succeeded || result.Principal == null)
        {
            return BadRequest("Google authentication failed or was canceled.");
        }
        
        
        var providerKey = result.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var provider = "Google";
        var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
        var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;
        
        if (string.IsNullOrEmpty(providerKey) || string.IsNullOrEmpty(email) ||  string.IsNullOrEmpty(provider))
        {
            return BadRequest("Essential user information was missing from Google.");
        }
        
        GoogleUserDto googleUser = new GoogleUserDto(name,email,provider,providerKey);
        
        var signedInUser = await _authService.HandleGoogleUser(googleUser);
        
        var token = _jwtService.GenerateToken(
            signedInUser.UserId,
            signedInUser.UserName,
            signedInUser.Email);

        // 👇 Set the HttpOnly cookie — JS cannot touch this
        Response.Cookies.Append("auth_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure   = true,                    // HTTPS only
            SameSite = SameSiteMode.Lax,
            Expires  = DateTimeOffset.UtcNow.AddDays(7)
        });
        
        return Ok(new { signedInUser.UserName, signedInUser.Email });
    }
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        Response.Cookies.Delete("auth_token");
        return Ok("Logout");
    }
    
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var userId   = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userName = User.FindFirstValue(ClaimTypes.Name);
        var email    = User.FindFirstValue(ClaimTypes.Email);
        return Ok(new { userId, userName, email });
    }
}