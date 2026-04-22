using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BannersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Banners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetBanners()
        {
            if (_context.Banners == null) return NotFound();
            return await _context.Banners.OrderByDescending(b => b.Id).ToListAsync();
        }

        // GET: api/Banners/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Banner>>> GetActiveBanners()
        {
            if (_context.Banners == null) return NotFound();
            return await _context.Banners.Where(b => b.IsActive).OrderByDescending(b => b.Id).ToListAsync();
        }

        // POST: api/Banners
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Banner>> CreateBanner(Banner banner)
        {
            if (_context.Banners == null) return Problem("Entity set 'AppDbContext.Banners' is null.");
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBanners), new { id = banner.Id }, banner);
        }

        // PUT: api/Banners/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateBanner(int id, Banner banner)
        {
            if (id != banner.Id) return BadRequest();

            _context.Entry(banner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BannerExists(id)) return NotFound();
                else throw;
            }

            return Ok(banner);
        }

        // DELETE: api/Banners/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            if (_context.Banners == null) return NotFound();
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BannerExists(int id)
        {
            return (_context.Banners?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
