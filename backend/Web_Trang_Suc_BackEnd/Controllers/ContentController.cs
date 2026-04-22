using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class ContentController2 : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ContentController2(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("banners")]
        public async Task<ActionResult<IEnumerable<object>>> GetBanners()
        {
            var banners = await _context.Banners!
                .Where(b => b.IsActive)
                .OrderByDescending(b => b.Id)
                .Select(b => new {
                    id = b.Id,
                    title = b.Title,
                    subtitle = b.Subtitle,
                    imageUrl = b.ImageUrl,
                    isActive = b.IsActive
                })
                .ToListAsync();

            return Ok(banners);
        }

        [HttpGet("banners/{id}")]
        public async Task<ActionResult<object>> GetBanner(int id)
        {
            var banner = await _context.Banners!
                .Where(b => b.Id == id)
                .Select(b => new {
                    id = b.Id,
                    title = b.Title,
                    subtitle = b.Subtitle,
                    imageUrl = b.ImageUrl,
                    isActive = b.IsActive
                })
                .FirstOrDefaultAsync();

            if (banner == null)
            {
                return NotFound();
            }

            return Ok(banner);
        }

        [HttpPost("banners")]
        public async Task<ActionResult<object>> CreateBanner([FromForm] CreateBannerDto createDto)
        {
            var banner = new Banner
            {
                Title = createDto.Title,
                Subtitle = createDto.Subtitle,
                ImageUrl = createDto.ImageUrl,
                IsActive = true
            };

            _context.Banners!.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, new {
                id = banner.Id,
                title = banner.Title,
                subtitle = banner.Subtitle,
                imageUrl = banner.ImageUrl,
                isActive = banner.IsActive
            });
        }

        [HttpPut("banners/{id}")]
        public async Task<IActionResult> UpdateBanner(int id, [FromForm] UpdateBannerDto updateDto)
        {
            var banner = await _context.Banners!.FindAsync(id);
            if (banner == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(updateDto.Title))
                banner.Title = updateDto.Title;

            if (!string.IsNullOrEmpty(updateDto.Subtitle))
                banner.Subtitle = updateDto.Subtitle;

            if (!string.IsNullOrEmpty(updateDto.ImageUrl))
                banner.ImageUrl = updateDto.ImageUrl;

            if (updateDto.IsActive.HasValue)
                banner.IsActive = updateDto.IsActive.Value;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new {
                    id = banner.Id,
                    title = banner.Title,
                    subtitle = banner.Subtitle,
                    imageUrl = banner.ImageUrl,
                    isActive = banner.IsActive
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", details = ex.Message });
            }
        }

        [HttpDelete("banners/{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var banner = await _context.Banners!.FindAsync(id);
            if (banner == null)
            {
                return NotFound();
            }

            try
            {
                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", details = ex.Message });
            }
        }

        [HttpPost("upload")]
        public async Task<ActionResult<object>> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không có file được tải lên" });
            }

            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/images/{uniqueFileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải file lên", details = ex.Message });
            }
        }

        [HttpGet("settings")]
        public async Task<ActionResult<object>> GetSettings()
        {
            var settings = await _context.ShopSettings!.FirstOrDefaultAsync();

            if (settings == null)
            {
                settings = new ShopSetting
                {
                    SiteName = "VELMORA",
                    SiteDescription = "Cửa hàng trang sức cao cấp",
                    ContactEmail = "support@velmora.com",
                    ContactPhone = "1900 1234",
                    Address = "123 Đường ABC, Quận 1, TP.HCM",
                    WorkingHours = "8:00 - 22:00",
                    FacebookUrl = "https://facebook.com/velmora",
                    InstagramUrl = "https://instagram.com/velmora"
                };

                _context.ShopSettings!.Add(settings);
                await _context.SaveChangesAsync();
            }

            return Ok(new {
                siteName = settings.SiteName,
                siteDescription = settings.SiteDescription,
                contactEmail = settings.ContactEmail,
                contactPhone = settings.ContactPhone,
                address = settings.Address,
                workingHours = settings.WorkingHours,
                facebookUrl = settings.FacebookUrl,
                instagramUrl = settings.InstagramUrl
            });
        }

        [HttpPut("settings")]
        public async Task<ActionResult<object>> UpdateSettings([FromBody] UpdateSettingsDto updateDto)
        {
            var settings = await _context.ShopSettings!.FirstOrDefaultAsync();
            if (settings == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(updateDto.SiteName))
                settings.SiteName = updateDto.SiteName;

            if (!string.IsNullOrEmpty(updateDto.SiteDescription))
                settings.SiteDescription = updateDto.SiteDescription;

            if (!string.IsNullOrEmpty(updateDto.ContactEmail))
                settings.ContactEmail = updateDto.ContactEmail;

            if (!string.IsNullOrEmpty(updateDto.ContactPhone))
                settings.ContactPhone = updateDto.ContactPhone;

            if (!string.IsNullOrEmpty(updateDto.Address))
                settings.Address = updateDto.Address;

            if (!string.IsNullOrEmpty(updateDto.WorkingHours))
                settings.WorkingHours = updateDto.WorkingHours;

            if (!string.IsNullOrEmpty(updateDto.FacebookUrl))
                settings.FacebookUrl = updateDto.FacebookUrl;

            if (!string.IsNullOrEmpty(updateDto.InstagramUrl))
                settings.InstagramUrl = updateDto.InstagramUrl;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new {
                    siteName = settings.SiteName,
                    siteDescription = settings.SiteDescription,
                    contactEmail = settings.ContactEmail,
                    contactPhone = settings.ContactPhone,
                    address = settings.Address,
                    workingHours = settings.WorkingHours,
                    facebookUrl = settings.FacebookUrl,
                    instagramUrl = settings.InstagramUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", details = ex.Message });
            }
        }
    }

    public class CreateBannerDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class UpdateBannerDto
    {
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UpdateSettingsDto
    {
        public string? SiteName { get; set; }
        public string? SiteDescription { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public string? Address { get; set; }
        public string? WorkingHours { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
    }
}
