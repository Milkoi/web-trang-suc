using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("product_variants")]
    public class ProductVariant
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("size")]
        [Required]
        [MaxLength(10)]
        public string Size { get; set; } = string.Empty; // 5, 5.5, 6, Medium, Large, 16", One Size

        [Column("color")]
        [Required]
        [MaxLength(30)]
        public string Color { get; set; } = string.Empty; // White Gold, Rose Gold, Yellow Gold, Platinum

        [Column("price")]
        [Required]
        public decimal Price { get; set; }

        [Column("stock_quantity")]
        public int StockQuantity { get; set; } = 0;

        [Column("sku")]
        [Required]
        [MaxLength(50)]
        public string Sku { get; set; } = string.Empty;

        // Navigation
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
