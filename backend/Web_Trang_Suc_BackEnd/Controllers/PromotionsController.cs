using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;
using web_Trang_suc_BE.Models.DTOs;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class PromotionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromotionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            var promotions = await _context.Promotions!
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(promotions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Promotion>> GetPromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            return Ok(promotion);
        }

        [HttpGet("validate/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> ValidatePromotion(string code, decimal orderAmount)
        {
            var promotion = await _context.Promotions!
                .FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower() && p.IsActive);

            if (promotion == null)
            {
                return BadRequest(new { valid = false, message = "Mã khuyên mãi không tìm tháy" });
            }

            if (DateTime.UtcNow < promotion.StartDate)
            {
                return BadRequest(new { valid = false, message = "Mã khuyên mãi chua có hiêu luc" });
            }

            if (DateTime.UtcNow > promotion.EndDate)
            {
                return BadRequest(new { valid = false, message = "Mã khuyên mãi dã hét hên" });
            }

            if (promotion.UsageLimit.HasValue && promotion.UsedCount >= promotion.UsageLimit.Value)
            {
                return BadRequest(new { valid = false, message = "Mã khuyên mãi dã dêt sô lân sû dung" });
            }

            if (promotion.MinOrderAmount.HasValue && orderAmount < promotion.MinOrderAmount.Value)
            {
                return BadRequest(new { 
                    valid = false, 
                    message = $"Dôn hàng tôi thiêu {promotion.MinOrderAmount:C} dê áp dung mã này" 
                });
            }

            return Ok(new { 
                valid = true, 
                discount = promotion.Discount,
                message = "Mã khuyên mãi hop lê"
            });
        }

        [HttpPost]
        public async Task<ActionResult<Promotion>> CreatePromotion(CreatePromotionDto createDto)
        {
            var existingPromotion = await _context.Promotions!
                .FirstOrDefaultAsync(p => p.Code.ToLower() == createDto.Code.ToLower());

            if (existingPromotion != null)
            {
                return BadRequest(new { message = "Mã khuyên mãi dã tôn tai" });
            }

            if (createDto.Discount < 0 || createDto.Discount > 100)
            {
                return BadRequest(new { message = "Giâm gia phâi nâm trong khoang 0-100%" });
            }

            if (createDto.StartDate >= createDto.EndDate)
            {
                return BadRequest(new { message = "Ngây bât dâu phâi tróc ngày kêt thúc" });
            }

            var promotion = new Promotion
            {
                Name = createDto.Name,
                Code = createDto.Code.ToUpper(),
                Discount = createDto.Discount,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                UsageLimit = createDto.UsageLimit,
                MinOrderAmount = createDto.MinOrderAmount,
                IsActive = true
            };

            _context.Promotions!.Add(promotion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPromotion), new { id = promotion.Id }, promotion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, UpdatePromotionDto updateDto)
        {
            var promotion = await _context.Promotions!.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(updateDto.Name))
                promotion.Name = updateDto.Name;

            if (!string.IsNullOrEmpty(updateDto.Code))
            {
                var existingPromotion = await _context.Promotions!
                    .FirstOrDefaultAsync(p => p.Id != id && p.Code.ToLower() == updateDto.Code.ToLower());

                if (existingPromotion != null)
                {
                    return BadRequest(new { message = "Mã khuyên mãi dã tôn tai" });
                }

                promotion.Code = updateDto.Code.ToUpper();
            }

            if (updateDto.Discount.HasValue)
            {
                if (updateDto.Discount < 0 || updateDto.Discount > 100)
                {
                    return BadRequest(new { message = "Giâm gia phâi nâm trong khoang 0-100%" });
                }
                promotion.Discount = updateDto.Discount.Value;
            }

            if (updateDto.StartDate.HasValue)
                promotion.StartDate = updateDto.StartDate.Value;

            if (updateDto.EndDate.HasValue)
                promotion.EndDate = updateDto.EndDate.Value;

            if (promotion.StartDate >= promotion.EndDate)
            {
                return BadRequest(new { message = "Ngây bât dâu phâi tróc ngày kêt thúc" });
            }

            if (updateDto.UsageLimit.HasValue)
                promotion.UsageLimit = updateDto.UsageLimit.Value;

            if (updateDto.MinOrderAmount.HasValue)
                promotion.MinOrderAmount = updateDto.MinOrderAmount.Value;

            if (updateDto.IsActive.HasValue)
                promotion.IsActive = updateDto.IsActive.Value;

            await _context.SaveChangesAsync();

            return Ok(promotion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/use")]
        [AllowAnonymous]
        public async Task<IActionResult> UsePromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            if (!promotion.IsActive)
            {
                return BadRequest(new { message = "Mã khuyên mãi không còn hiêu luc" });
            }

            if (DateTime.UtcNow < promotion.StartDate || DateTime.UtcNow > promotion.EndDate)
            {
                return BadRequest(new { message = "Mã khuyên mãi không trong khoang thô gian hiêu luc" });
            }

            if (promotion.UsageLimit.HasValue && promotion.UsedCount >= promotion.UsageLimit.Value)
            {
                return BadRequest(new { message = "Mã khuyên mãi dã hêt sô lân sû dung" });
            }

            promotion.UsedCount++;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sû dung mã khuyên mãi thành công" });
        }
    }
}
