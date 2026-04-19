using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    /// <summary>
    /// API quản lý các dịch vụ của cửa hàng
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Tags("Services - Quản lý dịch vụ")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các dịch vụ
        /// </summary>
        /// <returns>Danh sách các dịch vụ</returns>
        /// <response code="200">Trả về danh sách thành công</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            var services = await (_context.Services?.ToListAsync() ?? Task.FromResult(new List<Service>()));
            return Ok(services);
        }

        /// <summary>
        /// Lấy chi tiết một dịch vụ theo ID
        /// </summary>
        /// <param name="id">ID của dịch vụ</param>
        /// <returns>Chi tiết dịch vụ</returns>
        /// <response code="200">Trả về chi tiết thành công</response>
        /// <response code="404">Không tìm thấy dịch vụ</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            if (_context.Services == null)
                return NotFound(new { message = "Dịch vụ không tồn tại" });

            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound(new { message = "Dịch vụ không tồn tại" });
            }

            return Ok(service);
        }

        /// <summary>
        /// Tạo mới một dịch vụ
        /// </summary>
        /// <param name="service">Thông tin dịch vụ cần tạo</param>
        /// <returns>Dịch vụ vừa được tạo</returns>
        /// <response code="201">Tạo thành công</response>
        /// <response code="400">Dữ liệu không hợp lệ</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            _context.Services?.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = service.Id }, service);
        }

        /// <summary>
        /// Xóa một dịch vụ
        /// </summary>
        /// <param name="id">ID của dịch vụ cần xóa</param>
        /// <returns>Không trả về nội dung</returns>
        /// <response code="204">Xóa thành công</response>
        /// <response code="404">Không tìm thấy dịch vụ</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteService(int id)
        {
            if (_context.Services == null)
                return NotFound(new { message = "Dịch vụ không tồn tại" });

            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound(new { message = "Dịch vụ không tồn tại" });
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}