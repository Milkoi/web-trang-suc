using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;
using web_Trang_suc_BE.Models.DTOs;
using System.Text.RegularExpressions;
using System.Text;
using System.Globalization;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            try 
            {
                var promotions = await _context.Promotions!
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();
                return Ok(promotions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi SQL: " + ex.Message });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Promotion>> GetPromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);
            if (promotion == null) return NotFound();
            return Ok(promotion);
        }

        [HttpGet("available")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailablePromotions()
        {
            var now = DateTime.Now;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            // Lấy tất cả mã đang hoạt động/công khai
            var promotions = await _context.Promotions!
                .Where(p => p.IsActive && p.IsVisible)
                .Where(p => (!p.StartDate.HasValue || now >= p.StartDate) && 
                            (!p.EndDate.HasValue || now <= p.EndDate))
                .Where(p => !p.UsageLimit.HasValue || p.UsedCount < p.UsageLimit.Value)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            // Nếu user đã đăng nhập, kiểm tra xem họ đã lưu mã nào rồi
            List<int> claimedIds = new List<int>();
            if (!string.IsNullOrEmpty(userId))
            {
                claimedIds = await _context.UserVouchers!
                    .Where(uv => uv.UserId == userId)
                    .Select(uv => uv.PromotionId)
                    .ToListAsync();
            }

            var result = promotions.Select(p => new {
                p.Id,
                p.Name,
                p.Code,
                p.Discount,
                p.StartDate,
                p.EndDate,
                p.UsageLimit,
                p.UsedCount,
                p.MinOrderAmount,
                p.MaxDiscountAmount,
                p.Description,
                p.ImageUrl,
                IsClaimed = claimedIds.Contains(p.Id)
            });

            return Ok(result);
        }

        [HttpGet("my-vouchers")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyVouchers()
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            Console.WriteLine($"Fetching vouchers for UserID: [{userId}]");

            // Thực hiện Join để lấy cả thông tin Promotion
            var myVouchers = await (from uv in _context.UserVouchers!
                                    join p in _context.Promotions! on uv.PromotionId equals p.Id
                                    where uv.UserId == userId
                                    orderby uv.SavedAt descending
                                    select new {
                                        uv.Id,
                                        uv.IsUsed,
                                        uv.UsedAt,
                                        uv.SavedAt,
                                        Promotion = p
                                    }).ToListAsync();

            return Ok(myVouchers);
        }

        [HttpGet("validate/{code}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> ValidatePromotion(string code, [FromQuery] decimal orderAmount)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            var promotion = await _context.Promotions!
                .FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower());

            if (promotion == null)
                return BadRequest(new { valid = false, message = "Mã giảm giá không tồn tại" });

            if (!promotion.IsActive)
                return BadRequest(new { valid = false, message = "Mã giảm giá này đã bị vô hiệu hóa" });

            var now = DateTime.Now;

            if (promotion.StartDate.HasValue && now < promotion.StartDate)
                return BadRequest(new { valid = false, message = "Mã giảm giá chưa đến thời gian áp dụng" });

            if (promotion.EndDate.HasValue && now > promotion.EndDate)
                return BadRequest(new { valid = false, message = "Mã giảm giá đã hết thời gian áp dụng" });

            // Kiểm tra giới hạn tổng lượt dùng toàn hệ thống
            if (promotion.UsageLimit.HasValue && promotion.UsedCount >= promotion.UsageLimit.Value)
                return BadRequest(new { valid = false, message = "Mã giảm giá đã hết lượt sử dụng" });

            // KIỂM TRA MỖI NGƯỜI CHỈ DÙNG 1 LẦN
            if (!string.IsNullOrEmpty(userId))
            {
                var userVoucher = await _context.UserVouchers!
                    .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.PromotionId == promotion.Id);
                
                if (userVoucher != null && userVoucher.IsUsed)
                {
                    return BadRequest(new { valid = false, message = "Bạn đã sử dụng mã này cho đơn hàng khác rồi" });
                }
            }

            if (promotion.MinOrderAmount.HasValue && orderAmount < promotion.MinOrderAmount.Value)
            {
                return BadRequest(new { 
                    valid = false, 
                    message = $"Đơn hàng tối thiểu {promotion.MinOrderAmount:N0}₫ để áp dụng mã này" 
                });
            }

            // TÍNH TOÁN SỐ TIỀN GIẢM VÀ ÁP DỤNG TRẦN MAX DISCOUNT
            decimal discountAmount = orderAmount * (promotion.Discount / 100m);
            if (promotion.MaxDiscountAmount.HasValue && discountAmount > promotion.MaxDiscountAmount.Value)
            {
                discountAmount = promotion.MaxDiscountAmount.Value;
            }

            return Ok(new { 
                valid = true, 
                discountPercent = promotion.Discount,
                discountAmount = (int)discountAmount,
                message = "Áp dụng mã giảm giá thành công"
            });
        }

        [HttpPost]
        public async Task<ActionResult<Promotion>> CreatePromotion(CreatePromotionDto createDto)
        {
            try 
            {
                // LUÔN LUÔN TỰ SINH MÃ: MA + ID tiếp theo + Tên (ko dấu, ko cách)
                int nextId = 1;
                try {
                    var lastId = await _context.Promotions!.AnyAsync() 
                        ? await _context.Promotions!.MaxAsync(p => p.Id) 
                        : 0;
                    nextId = lastId + 1;
                } catch { /* Table might be empty or missing */ }
                
                string cleanName = RemoveDiacritics(createDto.Name ?? "").Replace(" ", "").ToUpper();
                if (cleanName.Length > 20) cleanName = cleanName.Substring(0, 20);
                
                string codeToUse = $"MA{nextId}{cleanName}";

                var promotion = new Promotion
                {
                    Name = createDto.Name,
                    Code = codeToUse,
                    Discount = createDto.Discount,
                    StartDate = createDto.StartDate,
                    EndDate = createDto.EndDate,
                    UsageLimit = createDto.UsageLimit,
                    MinOrderAmount = createDto.MinOrderAmount,
                    MaxDiscountAmount = createDto.MaxDiscountAmount,
                    Description = createDto.Description,
                    ImageUrl = createDto.ImageUrl,
                    IsVisible = createDto.IsVisible,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                };

                _context.Promotions!.Add(promotion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPromotion), new { id = promotion.Id }, promotion);
            }
            catch (Exception ex)
            {
                // Trả về lỗi chi tiết nhất có thể để debug
                var innerMsg = ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "";
                return StatusCode(500, new { message = "Lỗi khi lưu: " + ex.Message + innerMsg });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, UpdatePromotionDto updateDto)
        {
            var promotion = await _context.Promotions!.FindAsync(id);
            if (promotion == null) return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Name)) promotion.Name = updateDto.Name;
            if (!string.IsNullOrEmpty(updateDto.Code)) promotion.Code = updateDto.Code.ToUpper();
            if (updateDto.Discount.HasValue) promotion.Discount = updateDto.Discount.Value;
            if (updateDto.StartDate.HasValue) promotion.StartDate = updateDto.StartDate;
            if (updateDto.EndDate.HasValue) promotion.EndDate = updateDto.EndDate;
            if (updateDto.UsageLimit.HasValue) promotion.UsageLimit = updateDto.UsageLimit;
            if (updateDto.MinOrderAmount.HasValue) promotion.MinOrderAmount = updateDto.MinOrderAmount;
            if (updateDto.MaxDiscountAmount.HasValue) promotion.MaxDiscountAmount = updateDto.MaxDiscountAmount;
            if (updateDto.IsActive.HasValue) promotion.IsActive = updateDto.IsActive.Value;
            if (updateDto.IsVisible.HasValue) promotion.IsVisible = updateDto.IsVisible.Value;
            if (updateDto.Description != null) promotion.Description = updateDto.Description;
            if (updateDto.ImageUrl != null) promotion.ImageUrl = updateDto.ImageUrl;

            await _context.SaveChangesAsync();
            return Ok(promotion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _context.Promotions!.FindAsync(id);
            if (promotion == null) return NotFound();
            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPost("save/{id}")]
        public async Task<IActionResult> SaveVoucher(int id)
        {
            try 
            {
                var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var promotion = await _context.Promotions!.FindAsync(id);
                if (promotion == null) return NotFound(new { message = "Khuyến mãi không tồn tại" });

                var existing = await _context.UserVouchers!
                    .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.PromotionId == id);
                
                if (existing != null) return BadRequest(new { message = "Bạn đã lưu mã này rồi" });

                var userVoucher = new UserVoucher
                {
                    UserId = userId,
                    PromotionId = id,
                    SavedAt = DateTime.Now,
                    IsUsed = false
                };

                _context.UserVouchers!.Add(userVoucher);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Lưu mã khuyến mãi thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SaveVoucher: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Inner: {ex.InnerException.Message}");
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu mã: " + ex.Message });
            }
        }

        [HttpPost("use-voucher")]
        [AllowAnonymous]
        public async Task<IActionResult> UseVoucher([FromBody] UseVoucherRequest request)
        {
            var promotion = await _context.Promotions!
                .FirstOrDefaultAsync(p => p.Code == request.Code);

            if (promotion == null) return NotFound();

            // Nếu User đăng nhập, đánh dấu trong bảng UserVouchers
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                var userVoucher = await _context.UserVouchers!
                    .FirstOrDefaultAsync(uv => uv.UserId == userId && uv.PromotionId == promotion.Id);
                
                if (userVoucher != null)
                {
                    userVoucher.IsUsed = true;
                    userVoucher.UsedAt = DateTime.Now;
                }
            }

            promotion.UsedCount++;
            await _context.SaveChangesAsync();
            return Ok();
        }

        private string RemoveDiacritics(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }

    public class UseVoucherRequest {
        public string Code { get; set; } = string.Empty;
    }
}
