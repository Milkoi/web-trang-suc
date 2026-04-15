using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("product_variant_id")]
        public int ProductVariantId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; } = 1;

        [Column("price_at_purchase")]
        public decimal Price { get; set; }

        // Navigation properties
        [ForeignKey("OrderId")]
        public Order Order { get; set; } = null!;

        [ForeignKey("ProductVariantId")]
        public ProductVariant ProductVariant { get; set; } = null!;
    }
}