using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("shop_settings")]
    public class ShopSetting
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("phone")]
        [Required]
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Column("email")]
        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Column("workingHours")]
        [Required]
        [MaxLength(255)]
        public string WorkingHours { get; set; } = string.Empty;

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}