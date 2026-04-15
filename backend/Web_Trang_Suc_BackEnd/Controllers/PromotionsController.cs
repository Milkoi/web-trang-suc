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
    public class PromotionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromotionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Promotions (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetPromotions()
        {
            if (_context.Promotions == null) return NotFound();

            var promotions = await _context.Promotions.ToListAsync();
            var dtos = promotions.Select(p => new PromotionDto
            {
                Id = p.Id,
                Code = p.Code,
                Description = p.Description,
                DiscountValue = p.DiscountValue,
                DiscountType = p.DiscountType,
                MinOrderValue = p.MinOrderValue,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                UsageLimit = p.UsageLimit,
                UsedCount = p.UsedCount,
                Status = p.Status
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/Promotions
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PromotionDto>> CreatePromotion(PromotionCreateDto dto)
        {
            if (await _context.Promotions!.AnyAsync(p => p.Code == dto.Code))
            {
                return BadRequest("Promotion code already exists.");
            }

            var promotion = new Promotion
            {
                Code = dto.Code,
                Description = dto.Description,
                DiscountValue = dto.DiscountValue,
                DiscountType = dto.DiscountType,
                MinOrderValue = dto.MinOrderValue,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UsageLimit = dto.UsageLimit,
                Status = true
            };

            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPromotions), new { id = promotion.Id }, new PromotionDto
            {
                Id = promotion.Id,
                Code = promotion.Code,
                Description = promotion.Description,
                DiscountValue = promotion.DiscountValue,
                DiscountType = promotion.DiscountType
            });
        }

        // DELETE: api/Promotions/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);
            if (promotion == null) return NotFound();

            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Promotions/validate
        [HttpPost("validate")]
        public async Task<ActionResult<PromotionDto>> ValidatePromotion([FromBody] string code)
        {
            var p = await _context.Promotions!
                .FirstOrDefaultAsync(x => x.Code == code && x.Status == true);

            if (p == null) return NotFound("Invalid or inactive promotion code.");

            if (p.StartDate > DateTime.Now || p.EndDate < DateTime.Now)
                return BadRequest("Promotion code has expired.");

            if (p.UsageLimit.HasValue && p.UsedCount >= p.UsageLimit.Value)
                return BadRequest("Promotion code has reached its usage limit.");

            return Ok(new PromotionDto
            {
                Code = p.Code,
                DiscountValue = p.DiscountValue,
                DiscountType = p.DiscountType,
                MinOrderValue = p.MinOrderValue
            });
        }
    }
}
