using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.DTOs;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetFavorites()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Category)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Material)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Images)
                .Include(f => f.Product)
                    .ThenInclude(p => p.Variants)
                .Select(f => f.Product)
                .ToListAsync();

            var result = favorites.Select(p => new ProductDto
            {
                Id = p.Id,
                Sku = p.Sku,
                Name = p.Name,
                Price = p.Price,
                OriginalPrice = p.OriginalPrice,
                Category = p.Category?.Slug ?? "",
                Material = p.Material?.Slug ?? "",
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                Description = p.Description ?? "",
                InStock = p.StockQuantity > 0 || p.Variants.Any(v => v.StockQuantity > 0),
                IsNew = p.IsNew,
                IsSale = p.IsSale,
                Rating = p.Rating,
                Reviews = p.ReviewCount,
                AvailableSizes = p.Variants.Select(v => v.Size).Distinct().ToList(),
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    OriginalPrice = v.OriginalPrice,
                    StockQuantity = v.StockQuantity,
                    IsSale = v.IsSale
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult> AddFavorite(long productId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists) return NotFound("Product not found");

            var existing = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
            if (existing != null) return Ok(); // Already added

            var favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{productId}")]
        public async Task<ActionResult> RemoveFavorite(long productId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
            if (favorite == null) return NotFound();

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
