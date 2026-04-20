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

        [Column("name")]
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("code")]
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Column("discount")]
        [Range(0, 100)]
        public int Discount { get; set; }

        [Column("startDate")]
        public DateTime? StartDate { get; set; }

        [Column("endDate")]
        public DateTime? EndDate { get; set; }

        [Column("usageLimit")]
        public int? UsageLimit { get; set; }

        [Column("usedCount")]
        public int UsedCount { get; set; } = 0;

        [Column("minOrderAmount")]
        public decimal? MinOrderAmount { get; set; }

        [Column("maxDiscountAmount")]
        public decimal? MaxDiscountAmount { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("imageUrl")]
        public string? ImageUrl { get; set; }

        [Column("isActive")]
        public bool IsActive { get; set; } = true;

        [Column("isVisible")]
        public bool IsVisible { get; set; } = true;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
