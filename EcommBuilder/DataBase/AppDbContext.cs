using EcommBuilder.Auth;
using Microsoft.EntityFrameworkCore;

namespace EcommBuilder.DataBase;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Users>  Users { get; set; }
    
}