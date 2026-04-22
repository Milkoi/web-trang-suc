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
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Column("email")]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Column("workingHours")]
        [MaxLength(255)]
        public string WorkingHours { get; set; } = string.Empty;

        [Column("siteName")]
        [MaxLength(255)]
        public string? SiteName { get; set; }

        [Column("siteSubtitle")]
        [MaxLength(255)]
        public string? SiteSubtitle { get; set; }

        [Column("siteDescription")]
        public string? SiteDescription { get; set; }

        [Column("address")]
        [MaxLength(500)]
        public string? Address { get; set; }

        [Column("facebookUrl")]
        [MaxLength(255)]
        public string? FacebookUrl { get; set; }

        [Column("instagramUrl")]
        [MaxLength(255)]
        public string? InstagramUrl { get; set; }

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}