using Microsoft.AspNetCore.Mvc;
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
            var list = await _context.Categories!.ToListAsync();
            return list.Select(c => new CategoryDto { Id = c.Id, Slug = c.Slug, Name = c.Name, ImageUrl = c.ImageUrl }).ToList();
        }

        [HttpPost]
        public async Task<ActionResult> CreateCategory(CreateCategoryDto dto)
        {
            var cat = new Category { Slug = dto.Slug, Name = dto.Name, ImageUrl = dto.ImageUrl };
            _context.Categories!.Add(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, CreateCategoryDto dto)
        {
            var cat = await _context.Categories!.FindAsync(id);
            if (cat == null) return NotFound();
            cat.Slug = dto.Slug; cat.Name = dto.Name; cat.ImageUrl = dto.ImageUrl;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var cat = await _context.Categories!.FindAsync(id);
            if (cat == null) return NotFound();
            _context.Categories.Remove(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}