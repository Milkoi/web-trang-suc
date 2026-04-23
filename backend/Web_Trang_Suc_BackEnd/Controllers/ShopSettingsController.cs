using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopSettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShopSettingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ShopSettings
        [HttpGet]
        public async Task<ActionResult<ShopSetting>> GetSettings()
        {
            var settings = await _context.ShopSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new ShopSetting
                {
                    Phone = "1900 520 131",
                    Email = "luxelum@gmail.com",
                    WorkingHours = "T2-CN: 8:00 - 23:00"
                };
                _context.ShopSettings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return settings;
        }

        // PUT: api/ShopSettings
        [HttpPut]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateSettings([FromBody] ShopSetting settings)
        {
            var existing = await _context.ShopSettings.FirstOrDefaultAsync();
            if (existing == null)
            {
                settings.Id = 0;
                _context.ShopSettings.Add(settings);
            }
            else
            {
                existing.Email = settings.Email;
                existing.Phone = settings.Phone;
                existing.WorkingHours = settings.WorkingHours;
                existing.Address = settings.Address;
                existing.FacebookUrl = settings.FacebookUrl;
                existing.InstagramUrl = settings.InstagramUrl;
                existing.UpdatedAt = DateTime.Now;
                _context.Entry(existing).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return Ok(existing ?? settings);
        }
    }
}
