namespace web_Trang_suc_BE.Models.DTOs
{
    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalProducts { get; set; }
        public int TotalCustomers { get; set; }
        public List<RecentOrderDto> RecentOrders { get; set; } = new List<RecentOrderDto>();
        public List<TopProductDto> TopProducts { get; set; } = new List<TopProductDto>();
    }

    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class TopProductDto
    {
        public string Name { get; set; } = string.Empty;
        public int SalesCount { get; set; }
        public decimal Revenue { get; set; }
    }
}
