using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    /// <summary>
    /// API quản lý các nhà cung cấp
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Tags("Suppliers - Quản lý nhà cung cấp")]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuppliersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các nhà cung cấp
        /// </summary>
        /// <returns>Danh sách các nhà cung cấp</returns>
        /// <response code="200">Trả về danh sách thành công</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            var suppliers = await (_context.Suppliers?.ToListAsync() ?? Task.FromResult(new List<Supplier>()));
            return Ok(suppliers);
        }

        /// <summary>
        /// Lấy chi tiết một nhà cung cấp theo ID
        /// </summary>
        /// <param name="id">ID của nhà cung cấp</param>
        /// <returns>Chi tiết nhà cung cấp</returns>
        /// <response code="200">Trả về chi tiết thành công</response>
        /// <response code="404">Không tìm thấy nhà cung cấp</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Supplier>> GetSupplier(int id)
        {
            if (_context.Suppliers == null)
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });

            var supplier = await _context.Suppliers.FindAsync(id);

            if (supplier == null)
            {
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });
            }

            return Ok(supplier);
        }

        /// <summary>
        /// Tạo mới một nhà cung cấp (chỉ Admin)
        /// </summary>
        /// <param name="supplier">Thông tin nhà cung cấp cần tạo</param>
        /// <returns>Nhà cung cấp vừa được tạo</returns>
        /// <response code="201">Tạo thành công</response>
        /// <response code="400">Dữ liệu không hợp lệ</response>
        /// <response code="401">Chưa xác thực</response>
        /// <response code="403">Không có quyền Admin</response>
        [HttpPost]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<Supplier>> PostSupplier(Supplier supplier)
        {
            _context.Suppliers?.Add(supplier);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSupplier", new { id = supplier.Id }, supplier);
        }

        /// <summary>
        /// Xóa một nhà cung cấp (chỉ Admin)
        /// </summary>
        /// <param name="id">ID của nhà cung cấp cần xóa</param>
        /// <returns>Không trả về nội dung</returns>
        /// <response code="204">Xóa thành công</response>
        /// <response code="404">Không tìm thấy nhà cung cấp</response>
        /// <response code="401">Chưa xác thực</response>
        /// <response code="403">Không có quyền Admin</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            if (_context.Suppliers == null)
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });

            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
            {
                return NotFound(new { message = "Nhà cung cấp không tồn tại" });
            }

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}