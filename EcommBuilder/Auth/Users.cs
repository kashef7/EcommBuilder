using System.ComponentModel.DataAnnotations;

namespace EcommBuilder.Auth;

public class Users
{
    [Key][Required]
    public Guid UserId { get; set; }
    
    [MaxLength(45)]
    public string UserName { get; set; } = "Unknown";
    
    [Required][MaxLength(45)][EmailAddress]
    public string Email { get; set; }
    
    [Required][MaxLength(45)]
    public string Provider { get; set; }
    [Required]
    public string ProviderId { get; set; }
    
    [Required]
    public bool IsActive { get; set; } =  true;
}