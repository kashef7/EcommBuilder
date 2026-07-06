using System.ComponentModel.DataAnnotations;

namespace EcommBuilder.Shop;

public record CreateShopDto(
    [Required] [MaxLength(100)] string Name,
    [MaxLength(1000)] string Description = "", 
    [MaxLength(7)] string PrimaryColor = "#FFFFFF",
    [MaxLength(7)] string SecondaryColor = "#000000",
    [MaxLength(7)] string TertiaryColor = "#808080",
    [MaxLength(7)] string AccentColor = "#FF5733",
    [MaxLength(50)] string FontStyle = "Arial",
    [MaxLength(7)] string FontColor = "#000000",
    [MaxLength(500)] string? ProfilePictureUrl = null,
    Dictionary<string, string>? ContactInfo = null,
    List<string>? Tags = null
);

public record GetShopDto(
    [Required] [MaxLength(100)] string Name,
    [Required] [MaxLength(1000)] string Description,
    [Required] [MaxLength(7)] string PrimaryColor,
    [Required] [MaxLength(7)] string SecondaryColor,
    [Required] [MaxLength(7)] string TertiaryColor,
    [Required] [MaxLength(7)] string AccentColor,
    [Required] [MaxLength(50)] string FontStyle,
    [Required] [MaxLength(7)] string FontColor,
    [Required] [MaxLength(500)] string ProfilePictureUrl,
    Dictionary<string, string>? ContactInfo = null,
    List<string>? Tags = null
);

public record UpdateShopDto(
    [Required] [MaxLength(100)] string Name,
    [Required] [MaxLength(1000)] string Description,
    [Required] [MaxLength(7)] string PrimaryColor,
    [Required] [MaxLength(7)] string SecondaryColor,
    [Required] [MaxLength(7)] string TertiaryColor,
    [Required] [MaxLength(7)] string AccentColor,
    [Required] [MaxLength(50)] string FontStyle,
    [Required] [MaxLength(7)] string FontColor,
    [Required] [MaxLength(500)] string ProfilePictureUrl,
    Dictionary<string, string>? ContactInfo = null,
    List<string>? Tags = null
);
