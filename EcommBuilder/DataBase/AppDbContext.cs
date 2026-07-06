using EcommBuilder.Auth;
using EcommBuilder.Shop;
using Microsoft.EntityFrameworkCore;

namespace EcommBuilder.DataBase;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Users>  Users { get; set; }
    public DbSet<ShopModel> Shops { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ShopModel>(entity =>
        {
            entity.Property(s => s.ContactInfo)
                .HasColumnType("jsonb");
            
            entity.Property(s => s.PrimaryColor).HasDefaultValue("#FFFFFF");
            entity.Property(s => s.SecondaryColor).HasDefaultValue("#000000");
            entity.Property(s => s.TertiaryColor).HasDefaultValue("#808080");
            entity.Property(s => s.AccentColor).HasDefaultValue("#FF5733");
            entity.Property(s => s.FontStyle).HasDefaultValue("Arial");
            entity.Property(s => s.FontColor).HasDefaultValue("#000000");
        });
    }
}