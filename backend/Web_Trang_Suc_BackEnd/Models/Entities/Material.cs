using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("materials")]
    public class Material
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("slug")]
        [Required]
        [MaxLength(255)]
        public string Slug { get; set; } = string.Empty;

        [Column("name")]
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}