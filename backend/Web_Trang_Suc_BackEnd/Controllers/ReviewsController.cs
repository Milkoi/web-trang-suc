using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductReviews(long productId)
        {
            var reviews = await _context.Reviews!
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new {
                    id = r.Id,
                    userId = r.UserId,
                    userName = r.User != null ? r.User.FullName : "Anonymous",
                    rating = r.Rating,
                    comment = r.Comment,
                    createdAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        public class CreateReviewDto
        {
            public long ProductId { get; set; }
            public int Rating { get; set; }
            public string? Comment { get; set; }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview([FromBody] CreateReviewDto dto)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var user = await _context.Users!.FindAsync(userId);
                if (user == null) return Unauthorized();

                var review = new Review
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Rating = dto.Rating,
                    Comment = dto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Reviews!.Add(review);
                await _context.SaveChangesAsync();

                return Ok(new {
                    id = review.Id,
                    userId = review.UserId,
                    userName = user.FullName,
                    rating = review.Rating,
                    comment = review.Comment,
                    createdAt = review.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews!.FindAsync(id);
            if (review == null) return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
