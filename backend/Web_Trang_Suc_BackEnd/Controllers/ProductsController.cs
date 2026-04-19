using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.DTOs;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] string? search)
        {
            var query = _context.Products!
                .Include(p => p.Category)
                .Include(p => p.Material)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchLower) || 
                    (p.Description != null && p.Description.ToLower().Contains(searchLower)) ||
                    (p.Category != null && p.Category.Name.ToLower().Contains(searchLower)));
            }

            var products = await query.ToListAsync();

            return products.Select(p => new ProductDto
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
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(long id)
        {
            var p = await _context.Products!
                .Include(prod => prod.Category)
                .Include(prod => prod.Material)
                .Include(prod => prod.Images)
                .Include(prod => prod.Variants)
                .FirstOrDefaultAsync(prod => prod.Id == id);

            if (p == null) return NotFound();

            return new ProductDto
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
            };
        }
        
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> CreateProduct(CreateProductDto dto)
        {
            try
            {
                // Check if SKU already exists
                if (await _context.Products.AnyAsync(p => p.Sku.ToLower() == dto.Sku.ToLower()))
                {
                    return BadRequest(new { message = $"Mã SKU '{dto.Sku}' đã tồn tại trong hệ thống." });
                }

                var resolvedCategoryId = dto.CategoryId != 0 ? dto.CategoryId : await _context.Categories
                    .Where(c => c.Slug.ToLower() == (dto.Category ?? "").ToLower() || c.Name.ToLower() == (dto.Category ?? "").ToLower())
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

            var product = new Product
            {
                Sku = dto.Sku,
                Name = dto.Name,
                Price = dto.Price,
                OriginalPrice = dto.OriginalPrice,
                Description = dto.Description,
                OriginStory = dto.OriginStory,
                CategoryId = resolvedCategoryId != 0 ? resolvedCategoryId : null,
                MaterialId = dto.MaterialId != 0 ? (int?)dto.MaterialId : null,
                StockQuantity = dto.StockQuantity,
                IsNew = dto.IsNew,
                IsSale = dto.IsSale
            };

            if (dto.Images.Any())
            {
                foreach (var url in dto.Images)
                {
                    product.Images.Add(new ProductImage { Url = url });
                }
            }

            foreach (var v in dto.Variants)
            {
                product.Variants.Add(new ProductVariant
                {
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity,
                    IsSale = v.IsSale
                });
            }

                _context.Products!.Add(product);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu sản phẩm.", details = ex.Message });
            }
        }
        // PUT: api/Products/5 (Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProduct(long id, CreateProductDto dto)
        {
            try
            {
                var product = await _context.Products!
                    .Include(p => p.Variants)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null) return NotFound();

                // Refined variant update logic: Sync instead of Clear-and-Add
                var existingVariants = product.Variants.ToList();
                var incomingVariants = dto.Variants ?? new List<ProductVariantDto>();

                // 1. Update or Add
                foreach (var vDto in incomingVariants)
                {
                    var existing = existingVariants.FirstOrDefault(v => v.Id == vDto.Id || (vDto.Id == 0 && v.Sku == vDto.Sku));
                    if (existing != null)
                    {
                        existing.Sku = vDto.Sku;
                        existing.Size = vDto.Size;
                        existing.Price = vDto.Price;
                        existing.OriginalPrice = vDto.OriginalPrice;
                        existing.StockQuantity = vDto.StockQuantity;
                        existing.IsSale = vDto.IsSale;
                    }
                    else
                    {
                        product.Variants.Add(new ProductVariant
                        {
                            Sku = vDto.Sku,
                            Size = vDto.Size,
                            Price = vDto.Price,
                            OriginalPrice = vDto.OriginalPrice,
                            StockQuantity = vDto.StockQuantity,
                            IsSale = vDto.IsSale
                        });
                    }
                }

                // 2. Remove variants that are not in the incoming list
                var incomingIds = incomingVariants.Select(v => v.Id).Where(vId => vId != 0).ToList();
                var incomingSkus = incomingVariants.Select(v => v.Sku).ToList();

                var toRemove = existingVariants.Where(v => !incomingIds.Contains(v.Id) && !incomingSkus.Contains(v.Sku)).ToList();
                foreach (var vToRemove in toRemove)
                {
                    bool isUsed = await _context.OrderItems.AnyAsync(oi => oi.VariantId == vToRemove.Id);
                    if (!isUsed)
                    {
                        _context.ProductVariants.Remove(vToRemove);
                    }
                }

                if (product == null) return NotFound();

                // Check SKU duplicate (excluding current product)
                if (await _context.Products.AnyAsync(p => p.Sku.ToLower() == dto.Sku.ToLower() && p.Id != id))
                {
                    return BadRequest(new { message = $"Mã SKU '{dto.Sku}' đã bị trùng với một sản phẩm khác." });
                }

                product.Sku = dto.Sku;
                product.Name = dto.Name;
                product.Price = dto.Price;
                product.OriginalPrice = dto.OriginalPrice;
                product.Description = dto.Description;
                product.OriginStory = dto.OriginStory;
                product.StockQuantity = dto.StockQuantity;
                product.IsNew = dto.IsNew;
                product.IsSale = dto.IsSale;

                var resolvedCategoryId = dto.CategoryId != 0 ? dto.CategoryId : await _context.Categories
                    .Where(c => c.Slug.ToLower() == (dto.Category ?? "").ToLower() || c.Name.ToLower() == (dto.Category ?? "").ToLower())
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();
                
                product.CategoryId = resolvedCategoryId != 0 ? resolvedCategoryId : null;
                
                _context.ProductImages.RemoveRange(product.Images);
                foreach (var url in dto.Images)
                {
                    product.Images.Add(new ProductImage { Url = url });
                }
                


                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật sản phẩm.", details = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteProduct(long id)
        {
            var p = await _context.Products!.FindAsync(id);
            if (p == null) return NotFound();

            _context.Products.Remove(p);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}