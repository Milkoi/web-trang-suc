using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("promotions")]
    public class Promotion
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("code")]
        [Required]
        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(255)]
        public string? Description { get; set; }

        [Column("discount_value")]
        public decimal DiscountValue { get; set; }

        [Column("discount_type")]
        [MaxLength(20)]
        public string DiscountType { get; set; } = "FixedAmount"; // Percentage, FixedAmount

        [Column("min_order_value")]
        public decimal MinOrderValue { get; set; } = 0;

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("end_date")]
        public DateTime? EndDate { get; set; }

        [Column("usage_limit")]
        public int? UsageLimit { get; set; }

        [Column("used_count")]
        public int UsedCount { get; set; } = 0;

        [Column("status")]
        public bool Status { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
