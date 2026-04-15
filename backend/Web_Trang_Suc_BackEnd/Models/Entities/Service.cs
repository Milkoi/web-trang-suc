using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("services")]
    public class Service
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("icon_name")]
        [Required]
        [MaxLength(50)]
        public string IconName { get; set; } = string.Empty;

        [Column("title")]
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        [Required]
        [MaxLength(255)]
        public string Description { get; set; } = string.Empty;

        [Column("order_index")]
        public int OrderIndex { get; set; } = 0;
    }
}