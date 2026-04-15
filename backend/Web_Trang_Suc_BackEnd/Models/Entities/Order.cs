using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("order_code")]
        [MaxLength(255)]
        public string? OrderCode { get; set; }

        [Column("total_amount")]
        [Required]
        public decimal TotalAmount { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Pending"; // Pending, Shipping, Success, Cancel

        [Column("order_date")]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column("full_name")]
        [MaxLength(100)]
        public string? FullName { get; set; }

        [Column("email")]
        [MaxLength(100)]
        public string? Email { get; set; }

        [Column("phone")]
        [MaxLength(15)]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("payment_date")]
        public DateTime? PaymentDate { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
