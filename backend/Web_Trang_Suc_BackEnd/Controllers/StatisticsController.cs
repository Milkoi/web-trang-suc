using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models;
using web_Trang_suc_BE.Models.DTOs;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatisticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            var totalRevenue = await _context.Orders!.Where(o => o.Status == "Completed").SumAsync(o => o.TotalAmount);
            var totalOrders = await _context.Orders!.CountAsync();
            var totalProducts = await _context.Products!.CountAsync();
            var totalCustomers = await _context.Users!.Where(u => u.Role == "Customer").CountAsync();

            var recentOrders = await _context.Orders!
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    CustomerName = o.User != null ? o.User.FullName : "Unknown",
                    TotalPrice = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.OrderDate
                })
                .ToListAsync();

            // Mocking top products for now as it requires complex joining with OrderItems
            var topProducts = await _context.Products!
                .Take(5)
                .Select(p => new TopProductDto
                {
                    Name = p.Name,
                    SalesCount = 10, // Mock
                    Revenue = 150000000 // Mock
                })
                .ToListAsync();

            return Ok(new DashboardStatsDto
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalCustomers = totalCustomers,
                RecentOrders = recentOrders,
                TopProducts = topProducts
            });
        }
    }
}
