using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Column("brand_text")]
        [MaxLength(50)]
        public string BrandText { get; set; } = "Velmora";

        [Column("accent_color")]
        [MaxLength(50)]
        public string? AccentColor { get; set; }

        [Column("hover_accent")]
        [MaxLength(50)]
        public string? HoverAccent { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("origin_story")]
        public string? OriginStory { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [Column("supplier_id")]
        public int? SupplierId { get; set; }

        // Navigation
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        [ForeignKey("SupplierId")]
        public Supplier? Supplier { get; set; }

        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
