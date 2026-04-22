namespace web_Trang_suc_BE.Models.DTOs
{
    public class CategoryDto {
        public int Id { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class CreateCategoryDto {
        public string Slug { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }
}