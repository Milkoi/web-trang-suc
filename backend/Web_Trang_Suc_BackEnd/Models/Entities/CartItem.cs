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

        [Column("quantity")]
        public int Quantity { get; set; } = 1;
        
        // Ensure size parameter can be saved if needed, but SQL schema does not have size except if variants map it. Wait, the schema does have size: 
        // `size` varchar(50) DEFAULT NULL in SQL schema? Let me check SQL again, wait, cart_items doesn't have size in DB schema! 
        // Ah, looking back at web_trang_suc_db.sql: cart_items has `cartId`, `productId`, `variantId`, `quantity`. BUT no size! Wait, product_variants has size. 
        // But what about items without variants? The frontend allows `size?: string`. 
        // Let's add size to CartItem.cs just in case EF core creates it or it's needed? No, wait! DB schema didn't have size for cart_items. I will just rely on VariantId.

        // Navigation properties
        [ForeignKey("CartId")]
        public Cart Cart { get; set; } = null!;

        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!;

        [ForeignKey("VariantId")]
        public ProductVariant? ProductVariant { get; set; }
    }
}