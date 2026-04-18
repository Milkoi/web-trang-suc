namespace web_Trang_suc_BE.Models.DTOs
{
    public class CartItemDto
    {
        public long Id { get; set; }
        public ProductDto Product { get; set; } = null!;
        public int Quantity { get; set; }
        public string? Size { get; set; }
        public ProductVariantDto? Variant { get; set; }
        public decimal? PriceAtPurchase { get; set; }
    }

    public class AddToCartDto
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
        public int Quantity { get; set; } = 1;
        public string? Size { get; set; }
    }

    public class UpdateCartItemDto
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
        public string? Size { get; set; }
        public int Quantity { get; set; }
    }

    public class RemoveCartItemDto
    {
        public long ProductId { get; set; }
        public long? VariantId { get; set; }
        public string? Size { get; set; }
    }
}
