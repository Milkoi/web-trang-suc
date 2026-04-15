namespace web_Trang_suc_BE.Models.DTOs
{
    public class PromotionDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal DiscountValue { get; set; }
        public string DiscountType { get; set; } = string.Empty;
        public decimal MinOrderValue { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public bool Status { get; set; }
    }

    public class PromotionCreateDto
    {
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal DiscountValue { get; set; }
        public string DiscountType { get; set; } = "FixedAmount";
        public decimal MinOrderValue { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
    }
}
