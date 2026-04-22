namespace web_Trang_suc_BE.Models.DTOs
{
    public class ProductVariantDto
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int StockQuantity { get; set; }
        public bool IsSale { get; set; }
    }

    public class ProductDto
    {
        public long Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Category { get; set; } = string.Empty; // Slug representing category
        public string Material { get; set; } = string.Empty; // Slug
        public string? OriginStory { get; set; }
        public List<string> Images { get; set; } = new();
        public string Description { get; set; } = string.Empty;
        public bool InStock { get; set; }
        public bool IsNew { get; set; }
        public bool IsSale { get; set; }
        public decimal Rating { get; set; }
        public int Reviews { get; set; } // Matches JS reviewCount to reviews mapping
        public List<string>? AvailableSizes { get; set; }
        public List<ProductVariantDto>? Variants { get; set; }
    }
    
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int CategoryId { get; set; }
        public int MaterialId { get; set; }
        public string? OriginStory { get; set; }
        public string? Category { get; set; } // Added to match HEAD controller logic
        public List<string> Images { get; set; } = new(); // Added to match HEAD controller logic
        public List<ProductVariantDto> Variants { get; set; } = new(); // Added to match HEAD controller logic
        public string Description { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        public bool IsSale { get; set; }
        public int StockQuantity { get; set; }
    }
}