using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("sku")]
        [Required]
        [MaxLength(50)]
        public string Sku { get; set; } = string.Empty;

        [Column("name")]
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("categoryId")]
        public int? CategoryId { get; set; }

        [Column("materialId")]
        public int? MaterialId { get; set; }

        [Column("price")]
        public decimal Price { get; set; }

        [Column("originalPrice")]
        public decimal? OriginalPrice { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("stockQuantity")]
        public int StockQuantity { get; set; } = 0;

        [Column("rating")]
        public decimal Rating { get; set; } = 0;

        [Column("reviewCount")]
        public int ReviewCount { get; set; } = 0;

        [Column("isNew")]
        public bool IsNew { get; set; } = false;

        [Column("isSale")]
        public bool IsSale { get; set; } = false;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }

        [Column("originStory")]
        public string? OriginStory { get; set; }

        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}