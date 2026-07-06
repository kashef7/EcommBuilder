namespace EcommBuilder.Shop;
using System.ComponentModel.DataAnnotations;

public class ShopModel
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string OwnerId { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(7)]
    public string PrimaryColor { get; set; } = "#FFFFFF";

    [Required]
    [MaxLength(7)]
    public string SecondaryColor { get; set; } = "#000000";

    [Required]
    [MaxLength(7)]
    public string TertiaryColor { get; set; } = "#808080";

    [Required]
    [MaxLength(7)]
    public string AccentColor { get; set; } = "#FF5733";

    [Required]
    [MaxLength(50)]
    public string FontStyle { get; set; } = "Arial";

    [Required]
    [MaxLength(7)]
    public string FontColor { get; set; } = "#000000";

    [MaxLength(500)]
    public string? ProfilePictureUrl { get; set; }
    
    public Dictionary<string, string> ContactInfo { get; set; } = new();
    public List<string> Tags { get; set; } = new();

}