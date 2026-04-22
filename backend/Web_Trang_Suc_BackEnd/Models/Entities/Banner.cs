using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("banners")]
    public class Banner
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("imageUrl")]
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Column("subtitle")]
        [MaxLength(255)]
        public string? Subtitle { get; set; }

        [Column("title")]
        [MaxLength(255)]
        public string? Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("isActive")]
        public bool IsActive { get; set; } = true;
    }
}
