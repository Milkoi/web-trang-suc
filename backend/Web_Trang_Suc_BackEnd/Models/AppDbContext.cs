using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User>? Users { get; set; }
        public DbSet<ProductVariant>? ProductVariants { get; set; }
        public DbSet<Wishlist>? Wishlists { get; set; }
        public DbSet<Service>? Services { get; set; }
        public DbSet<Supplier>? Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Additional configurations if needed
        }
    }
}