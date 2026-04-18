using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("cart_items")]
    public class CartItem
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("cartId")]
        public long CartId { get; set; }

        [Column("productId")]
        public long ProductId { get; set; }

        [Column("variantId")]
        public long? VariantId { get; set; }

        [Column("size")]
        public string? Size { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; } = 1;


        // Navigation properties
        [ForeignKey("CartId")]
        public Cart Cart { get; set; } = null!;

        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!;

        [ForeignKey("VariantId")]
        public ProductVariant? ProductVariant { get; set; }
    }
}