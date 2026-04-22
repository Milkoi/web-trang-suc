using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("orderId")]
        [Required]
        public string OrderId { get; set; } = string.Empty;

        [Column("productId")]
        public long ProductId { get; set; }

        [Column("variantId")]
        public long? VariantId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("size")]
        [MaxLength(50)]
        public string? Size { get; set; }

        [Column("priceAtPurchase")]
        public decimal PriceAtPurchase { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [ForeignKey("VariantId")]
        public ProductVariant? Variant { get; set; }
    }
}