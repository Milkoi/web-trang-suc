using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("favorites")]
    public class Favorite
    {
        [Column("userId")]
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Column("productId")]
        public long ProductId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}