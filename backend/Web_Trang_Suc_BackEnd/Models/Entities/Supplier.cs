using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("suppliers")]
    public class Supplier
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Column("phone")]
        [MaxLength(15)]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        // Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
