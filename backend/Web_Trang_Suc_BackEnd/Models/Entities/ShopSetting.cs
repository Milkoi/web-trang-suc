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

        [Column("siteName")]
        [MaxLength(255)]
        public string SiteName { get; set; } = string.Empty;

        [Column("siteDescription")]
        [MaxLength(1000)]
        public string? SiteDescription { get; set; }

        [Column("contactEmail")]
        [MaxLength(255)]
        public string? ContactEmail { get; set; }

        [Column("contactPhone")]
        [MaxLength(50)]
        public string? ContactPhone { get; set; }

        [Column("address")]
        [MaxLength(500)]
        public string? Address { get; set; }

        [Column("workingHours")]
        [MaxLength(100)]
        public string? WorkingHours { get; set; }

        [Column("facebookUrl")]
        [MaxLength(255)]
        public string? FacebookUrl { get; set; }

        [Column("instagramUrl")]
        [MaxLength(255)]
        public string? InstagramUrl { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}