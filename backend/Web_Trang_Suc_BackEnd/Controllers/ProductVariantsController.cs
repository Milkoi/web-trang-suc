using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    /// <summary>
    /// API quản lý các biến thể sản phẩm (size, giá, kho hàng, v.v.)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Tags("Product Variants - Quản lý biến thể sản phẩm")]
    public class ProductVariantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductVariantsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các biến thể sản phẩm
        /// </summary>
        /// <returns>Danh sách các biến thể sản phẩm kèm thông tin sản phẩm</returns>
        /// <response code="200">Trả về danh sách thành công</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ProductVariant>>> GetProductVariants()
        {
            var variants = await (_context.ProductVariants?.Include(pv => pv.Product).ToListAsync() ?? Task.FromResult(new List<ProductVariant>()));
            return Ok(variants);
        }

        /// <summary>
        /// Lấy chi tiết một biến thể sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID của biến thể sản phẩm</param>
        /// <returns>Chi tiết biến thể sản phẩm</returns>
        /// <response code="200">Trả về chi tiết thành công</response>
        /// <response code="404">Không tìm thấy biến thể sản phẩm</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductVariant>> GetProductVariant(int id)
        {
            if (_context.ProductVariants == null)
                return NotFound(new { message = "Biến thể sản phẩm không tồn tại" });

            var productVariant = await _context.ProductVariants.Include(pv => pv.Product).FirstOrDefaultAsync(pv => pv.Id == id);

            if (productVariant == null)
            {
                return NotFound(new { message = "Biến thể sản phẩm không tồn tại" });
            }

            return Ok(productVariant);
        }

        /// <summary>
        /// Tạo mới một biến thể sản phẩm (chỉ Admin)
        /// </summary>
        /// <param name="productVariant">Thông tin biến thể sản phẩm cần tạo</param>
        /// <returns>Biến thể sản phẩm vừa được tạo</returns>
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
        public async Task<ActionResult<ProductVariant>> PostProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants?.Add(productVariant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductVariant", new { id = productVariant.Id }, productVariant);
        }

        // DELETE: api/ProductVariants/5
        /// <summary>
        /// Xóa một biến thể sản phẩm (chỉ Admin)
        /// </summary>
        /// <param name="id">ID của biến thể sản phẩm cần xóa</param>
        /// <returns>Không trả về nội dung</returns>
        /// <response code="204">Xóa thành công</response>
        /// <response code="404">Không tìm thấy biến thể sản phẩm</response>
        /// <response code="401">Chưa xác thực</response>
        /// <response code="403">Không có quyền Admin</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteProductVariant(int id)
        {
            if (_context.ProductVariants == null)
                return NotFound(new { message = "Biến thể sản phẩm không tồn tại" });

            var productVariant = await _context.ProductVariants.FindAsync(id);
            if (productVariant == null)
            {
                return NotFound(new { message = "Biến thể sản phẩm không tồn tại" });
            }

            _context.ProductVariants.Remove(productVariant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}