using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StatisticsController(AppDbContext context) { _context = context; }

        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            var totalOrders = await _context.Orders!.CountAsync();
            var totalRevenue = await _context.Orders!.SumAsync(o => o.TotalAmount);
            var newUsers = await _context.Users!.CountAsync();
            var productCount = await _context.Products!.CountAsync();
            
            var recentOrders = await _context.Orders!
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new {
                    id = o.Id,
                    customerName = o.FirstName + " " + o.LastName,
                    totalPrice = o.TotalAmount,
                    status = o.OrderStatus
                })
                .ToListAsync();

            return Ok(new {
                totalRevenue = totalRevenue,
                totalOrders = totalOrders,
                totalCustomers = newUsers,
                totalProducts = productCount,
                recentOrders = recentOrders
            });
        }
    }
}