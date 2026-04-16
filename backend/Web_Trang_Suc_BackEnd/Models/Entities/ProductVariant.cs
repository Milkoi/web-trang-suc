using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("product_variants")]
    public class ProductVariant
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("productId")]
        public long ProductId { get; set; }

        [Column("sku")]
        [Required]
        [MaxLength(100)]
        public string Sku { get; set; } = string.Empty;

        [Column("size")]
        [Required]
        [MaxLength(50)]
        public string Size { get; set; } = string.Empty;

        [Column("price")]
        public decimal Price { get; set; }

        [Column("originalPrice")]
        public decimal? OriginalPrice { get; set; }

        [Column("stockQuantity")]
        public int StockQuantity { get; set; } = 0;

        [Column("isSale")]
        public bool IsSale { get; set; } = false;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}