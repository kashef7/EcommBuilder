using System.ComponentModel.DataAnnotations;

namespace EcommBuilder.Auth;

public record GoogleUserDto(
    [MaxLength(100)] string UserName,
    [Required][EmailAddress] string Email,
    [Required][MaxLength(50)] string Provider,
    [Required] string ProviderId
);

public record SignedInUserDto(
    Guid UserId, 
    [MaxLength(100)] string UserName,
    [Required][EmailAddress] string Email
);