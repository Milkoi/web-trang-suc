using Microsoft.AspNetCore.Authorization;
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

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            if (_context.Products == null) return NotFound();

            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .ToListAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
                Category = MapCategorySlug(p.Category?.Name),
                Images = p.ImageUrl != null ? new List<string> { p.ImageUrl } : new List<string>(),
                InStock = p.Variants.Any(v => v.StockQuantity > 0),
                IsNew = true, 
                IsSale = p.Variants.Any(v => v.Price < 100000000), 
                OriginStory = p.OriginStory,
                Rating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 5,
                Reviews = p.Reviews.Count,
                Sku = p.Variants.FirstOrDefault()?.Sku ?? "N/A",
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity
                }).ToList()
            }).ToList();

            return Ok(productDtos);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            if (_context.Products == null) return NotFound();

            var p = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return NotFound();

            var dto = new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
                Category = MapCategorySlug(p.Category?.Name),
                Images = p.ImageUrl != null ? new List<string> { p.ImageUrl } : new List<string>(),
                InStock = p.Variants.Any(v => v.StockQuantity > 0),
                IsNew = true,
                OriginStory = p.OriginStory,
                Rating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 5,
                Reviews = p.Reviews.Count,
                Sku = p.Variants.FirstOrDefault()?.Sku ?? "N/A",
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity
                }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/Products (Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                OriginStory = dto.OriginStory,
                CategoryId = await _context.Categories!.Where(c => c.Name.ToLower() == dto.Category.ToLower()).Select(c => c.Id).FirstOrDefaultAsync(),
                ImageUrl = dto.Images.FirstOrDefault()
            };

            foreach (var v in dto.Variants)
            {
                product.Variants.Add(new ProductVariant
                {
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity ?? 0,
                    Color = "Standard" // Default for now
                });
            }

            _context.Products!.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, dto);
        }

        // PUT: api/Products/5 (Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            var product = await _context.Products!
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.OriginStory = dto.OriginStory;
            product.ImageUrl = dto.Images.FirstOrDefault();
            
            // Simplified variant update logic: clear and re-add for now
            _context.ProductVariants!.RemoveRange(product.Variants);
            foreach (var v in dto.Variants)
            {
                product.Variants.Add(new ProductVariant
                {
                    Sku = v.Sku,
                    Size = v.Size,
                    Price = v.Price,
                    StockQuantity = v.StockQuantity ?? 0,
                    Color = "Standard"
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Products/5 (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products!.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string MapCategorySlug(string? categoryName)
        {
            if (string.IsNullOrEmpty(categoryName)) return "other";
            
            return categoryName.ToLower() switch
            {
                "nhẫn" => "ring",
                "dây chuyền" => "necklace",
                "lắc tay" => "bracelet",
                "bông tai" => "earring",
                "lắc chân" => "anklet",
                _ => categoryName.ToLower()
            };
        }
    }
}
