using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Models.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Category { get; set; }
        public string Material { get; set; } = "gold"; // Default for now
        public List<string> Images { get; set; } = new List<string>();
        public string? Description { get; set; }
        public string? OriginStory { get; set; }
        public bool InStock { get; set; }
        public bool IsNew { get; set; }
        public bool IsSale { get; set; }
        public double Rating { get; set; } = 5.0;
        public int Reviews { get; set; } = 0;
        public string Sku { get; set; } = string.Empty;
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    }

    public class ProductVariantDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? StockQuantity { get; set; }
        public bool? IsSale { get; set; }
    }
}
