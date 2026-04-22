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
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoriesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _context.Categories
                .Include(c => c.Products)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Slug = c.Slug,
                Name = c.Name,
                ImageUrl = c.ImageUrl,
                Description = c.Description,
                ProductCount = c.Products?.Count ?? 0,
                CreatedAt = c.CreatedAt
            }).ToList();
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> CreateCategory(CreateCategoryDto dto)
        {
            if (await _context.Categories.AnyAsync(c => c.Name == dto.Name || c.Slug == dto.Slug))
            {
                return BadRequest("Category name or slug already exists.");
            }

            var category = new Category
            {
                Slug = dto.Slug,
                Name = dto.Name,
                ImageUrl = dto.ImageUrl,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> UpdateCategory(int id, CreateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            if (await _context.Categories.AnyAsync(c => (c.Name == dto.Name || c.Slug == dto.Slug) && c.Id != id))
            {
                return BadRequest("Category name or slug already exists.");
            }

            category.Slug = dto.Slug;
            category.Name = dto.Name;
            category.ImageUrl = dto.ImageUrl;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return NotFound();

            if (category.Products != null && category.Products.Any())
            {
                return BadRequest("Cannot delete category containing products.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}