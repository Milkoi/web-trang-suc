using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
        public OrdersController(AppDbContext context) { _context = context; }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllOrders()
        {
            var list = await _context.Orders!.Include(o => o.Items).ThenInclude(i => i.Product).ToListAsync();
            return Ok(list);
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var list = await _context.Orders!.Include(o => o.Items).ThenInclude(i => i.Product)
                                     .Where(o => o.UserId == userId).ToListAsync();
            return Ok(list);
        }

        [HttpPost("place-order")]
        public async Task<ActionResult> PlaceOrder([FromBody] CheckoutDto dto)
        {
            // Simplified order placement
            var orderId = "ORD-" + new Random().Next(1000, 9999);
            var userId = "";
            try { userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; } catch {}

            var order = new Order {
                Id = orderId,
                UserId = string.IsNullOrEmpty(userId) ? null : userId,
                FirstName = dto.Shipping.FirstName,
                LastName = dto.Shipping.LastName,
                Email = dto.Email,
                Phone = dto.Shipping.Phone ?? "",
                Address = dto.Shipping.Address,
                City = dto.Shipping.City,
                Country = dto.Shipping.Country,
                ShippingMethod = dto.ShippingMethod,
                PaymentMethod = dto.Payment.Method,
                TotalAmount = 0 // Compute properly in real app
            };

            // Needs mapping of Dto.Cart items to order.Items
            _context.Orders!.Add(order);
            await _context.SaveChangesAsync();
            
            return Ok(new { orderId = order.Id });
        }
    }
}