using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products!
                .Include(p => p.Category)
                .Include(p => p.Material)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .ToListAsync();

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
                .Include(prod => prod.Reviews)
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
        public async Task<ActionResult> CreateProduct(CreateProductDto dto)
        {
            var product = new Product
            {
                Sku = dto.Sku,
                Name = dto.Name,
                Price = dto.Price,
                OriginalPrice = dto.OriginalPrice,
                Description = dto.Description,
                OriginStory = dto.OriginStory,
                CategoryId = dto.CategoryId != 0 ? dto.CategoryId : await _context.Categories.Where(c => c.Name.ToLower() == (dto.Category ?? "").ToLower()).Select(c => c.Id).FirstOrDefaultAsync(),
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
        // PUT: api/Products/5 (Admin only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            var product = await _context.Products!
                .Include(p => p.Variants)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.OriginStory = dto.OriginStory;
            
            // Simplified variant update logic: clear and re-add for now
            _context.ProductVariants.RemoveRange(product.Variants);
            foreach (var v in dto.Variants ?? new())
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

            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
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