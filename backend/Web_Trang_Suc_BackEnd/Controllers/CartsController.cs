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
    public class CartsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartsController(AppDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }

        private async Task<Cart> GetOrCreateCart(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Category)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Images)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Variants)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return Ok(new List<CartItemDto>());

            var items = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                Quantity = ci.Quantity,
                Size = ci.ProductVariant?.Size,
                Product = new ProductDto
                {
                    Id = ci.Product.Id,
                    Name = ci.Product.Name,
                    Price = ci.Product.Price,
                    OriginalPrice = ci.Product.OriginalPrice,
                    Category = ci.Product.Category?.Slug ?? "",
                    Images = ci.Product.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                    IsNew = ci.Product.IsNew,
                    IsSale = ci.Product.IsSale,
                    InStock = ci.Product.StockQuantity > 0 || ci.Product.Variants.Any(v => v.StockQuantity > 0),
                    Variants = ci.Product.Variants.Select(v => new ProductVariantDto
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
                },
                Variant = ci.ProductVariant != null ? new ProductVariantDto
                {
                    Id = ci.ProductVariant.Id,
                    ProductId = ci.ProductVariant.ProductId,
                    Sku = ci.ProductVariant.Sku,
                    Size = ci.ProductVariant.Size,
                    Price = ci.ProductVariant.Price,
                    OriginalPrice = ci.ProductVariant.OriginalPrice,
                    StockQuantity = ci.ProductVariant.StockQuantity,
                    IsSale = ci.ProductVariant.IsSale
                } : null,
                PriceAtPurchase = ci.ProductVariant?.Price ?? ci.Product.Price
            }).ToList();

            return Ok(items);
        }

        [HttpPost("items")]
        public async Task<ActionResult> AddToCart(AddToCartDto dto)
        {
            var userId = GetUserId();
            var cart = await GetOrCreateCart(userId);

            var existingItem = cart.CartItems.FirstOrDefault(i => 
                i.ProductId == dto.ProductId && 
                i.VariantId == dto.VariantId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    VariantId = dto.VariantId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("items")]
        public async Task<ActionResult> UpdateQuantity(UpdateCartItemDto dto)
        {
            var userId = GetUserId();
            var cart = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null) return NotFound();

            var item = cart.CartItems.FirstOrDefault(i => 
                i.ProductId == dto.ProductId && 
                i.VariantId == dto.VariantId);

            if (item == null) return NotFound();

            if (dto.Quantity <= 0)
            {
                _context.CartItems.Remove(item);
            }
            else
            {
                item.Quantity = dto.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("items")]
        public async Task<ActionResult> RemoveFromCart([FromBody] RemoveCartItemDto dto)
        {
            var userId = GetUserId();
            var cart = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null) return NotFound();

            var item = cart.CartItems.FirstOrDefault(i => 
                i.ProductId == dto.ProductId && 
                i.VariantId == dto.VariantId);

            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = GetUserId();
            var cart = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart != null && cart.CartItems.Any())
            {
                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
