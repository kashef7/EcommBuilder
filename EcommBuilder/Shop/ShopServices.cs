using EcommBuilder.DataBase;

namespace EcommBuilder.Shop;

public class ShopServices : IShopService
{
    private readonly AppDbContext _context;

    public ShopServices(AppDbContext context) => _context = context;


    public async Task<GetShopDto> CreateShopAsync(CreateShopDto createShopDto, string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<GetShopDto?> UpdateShopAsync(Guid shopId, UpdateShopDto updateShopDto, string userId)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteShopAsync(Guid shopId, string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<GetShopDto?> GetShopAsync(Guid shopId)
    {
        throw new NotImplementedException();
    }
}