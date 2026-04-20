using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("user_vouchers")]
    public class UserVoucher
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("userId")]
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Column("promotionId")]
        public int PromotionId { get; set; }

        [Column("savedAt")]
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        [Column("isUsed")]
        public bool IsUsed { get; set; } = false;

        [Column("usedAt")]
        public DateTime? UsedAt { get; set; }
    }
}
