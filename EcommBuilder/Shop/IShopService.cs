namespace EcommBuilder.Shop;

public interface IShopService
{
    Task<GetShopDto> CreateShopAsync(CreateShopDto createShopDto, string userId);
    
    Task<GetShopDto?> UpdateShopAsync(Guid shopId, UpdateShopDto updateShopDto, string userId);
    
    Task DeleteShopAsync(Guid shopId, string userId);
    
    Task<GetShopDto?> GetShopAsync(Guid shopId);
}