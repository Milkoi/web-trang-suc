using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("product_images")]
    public class ProductImage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("productId")]
        public long ProductId { get; set; }

        [Column("url")]
        [Required]
        public string Url { get; set; } = string.Empty;

        [Column("isMain")]
        public bool IsMain { get; set; } = false;

        [Column("displayOrder")]
        public int DisplayOrder { get; set; } = 0;

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}