using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("cart_items")]
    public class CartItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("cart_id")]
        public int CartId { get; set; }

        [Column("product_variant_id")]
        public int ProductVariantId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; } = 1;

        // Navigation properties
        [ForeignKey("CartId")]
        public Cart Cart { get; set; } = null!;

        [ForeignKey("ProductVariantId")]
        public ProductVariant ProductVariant { get; set; } = null!;
    }
}