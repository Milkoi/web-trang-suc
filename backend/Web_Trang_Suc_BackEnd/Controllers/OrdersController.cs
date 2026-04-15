using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.DTOs;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            if (_context.Orders == null) return NotFound();

            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(v => v.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var dtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId ?? 0,
                CustomerName = o.User?.FullName ?? "Unknown",
                TotalPrice = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.OrderDate,
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductVariant?.ProductId ?? 0,
                    ProductName = oi.ProductVariant?.Product?.Name ?? "Product Deleted",
                    Size = oi.ProductVariant?.Size ?? "N/A",
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            }).ToList();

            return Ok(dtos);
        }

        // GET: api/Orders/MyOrders (Customer only)
        [HttpGet("my-orders")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var orders = await _context.Orders!
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(v => v.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var dtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = userId,
                TotalPrice = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.OrderDate,
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductVariant?.ProductId ?? 0,
                    ProductName = oi.ProductVariant?.Product?.Name ?? "Product Deleted",
                    Size = oi.ProductVariant?.Size ?? "N/A",
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            }).ToList();

            return Ok(dtos);
        }

        // PATCH: api/Orders/5/status (Admin only)
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, OrderStatusUpdateDto dto)
        {
            var order = await _context.Orders!.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Orders/place-order
        [HttpPost("place-order")]
        public async Task<ActionResult<OrderDto>> PlaceOrder(CheckoutDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("No items in order.");

            int? userId = null;
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int parsedId)) userId = parsedId;

            // Calculate total and prepare items
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in dto.Items)
            {
                var variant = await _context.ProductVariants!.FindAsync(item.ProductVariantId);
                if (variant == null) return BadRequest($"Product variant {item.ProductVariantId} not found.");

                totalAmount += variant.Price * item.Quantity;
                orderItems.Add(new OrderItem
                {
                    ProductVariantId = variant.Id,
                    Quantity = item.Quantity,
                    Price = variant.Price
                });
            }

            var order = new Order
            {
                UserId = userId,
                OrderCode = "ORD-" + DateTime.Now.Ticks.ToString().Substring(10),
                TotalAmount = totalAmount,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                FullName = dto.RecipientName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = $"{dto.Address}, {dto.Apartment}, {dto.City}, {dto.Country}".Trim(',',' '),
                OrderItems = orderItems
            };

            _context.Orders!.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new OrderDto
            {
                Id = order.Id,
                CustomerName = order.FullName ?? "Guest",
                TotalPrice = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.OrderDate
            });
        }
    }
}
