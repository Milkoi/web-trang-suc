using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaterialsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMaterials()
        {
            var materials = await _context.Materials
                .Select(m => new { id = m.Slug, label = m.Name })
                .ToListAsync();

            return Ok(materials);
        }
    }
}
