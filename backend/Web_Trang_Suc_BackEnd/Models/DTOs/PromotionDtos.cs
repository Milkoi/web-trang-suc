namespace web_Trang_suc_BE.Models.DTOs
{
    public class PromotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Discount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public bool IsActive { get; set; }
        public bool IsVisible { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreatePromotionDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; } // Cho phép null vì Backend tự sinh
        public int Discount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsVisible { get; set; } = true;
    }

    public class UpdatePromotionDto
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public int? Discount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVisible { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
