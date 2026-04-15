using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_Trang_suc_BE.Models.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("full_name")]
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Column("email")]
        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Column("password")]
        [MaxLength(255)]
        public string? Password { get; set; }

        [Column("role")]
        public string Role { get; set; } = "Customer"; // Admin, Staff, Customer

        [Column("auth_provider")]
        public string AuthProvider { get; set; } = "local"; // local, google

        [Column("google_id")]
        [MaxLength(255)]
        public string? GoogleId { get; set; }

        [Column("phone")]
        [MaxLength(15)]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        [Column("last_login_at")]
        public DateTime? LastLoginAt { get; set; }

        [Column("login_ip")]
        [MaxLength(50)]
        public string? LoginIp { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public Cart? Cart { get; set; }
    }
}
