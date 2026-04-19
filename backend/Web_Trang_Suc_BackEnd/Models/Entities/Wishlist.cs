using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("wishlist")]
    public class Wishlist
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("userId")]
        public string UserId { get; set; } = string.Empty;

        [Column("productId")]
        public long ProductId { get; set; }

        [Column("addedAt")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}