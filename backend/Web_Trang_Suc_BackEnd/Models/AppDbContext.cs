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
        public DbSet<Product>? Products { get; set; }
        public DbSet<ProductVariant>? ProductVariants { get; set; }
        public DbSet<Category>? Categories { get; set; }
        public DbSet<Cart>? Carts { get; set; }
        public DbSet<CartItem>? CartItems { get; set; }
        public DbSet<Order>? Orders { get; set; }
        public DbSet<OrderItem>? OrderItems { get; set; }
        public DbSet<Wishlist>? Wishlists { get; set; }
        public DbSet<Service>? Services { get; set; }
        public DbSet<Supplier>? Suppliers { get; set; }
        public DbSet<Review>? Reviews { get; set; }
        public DbSet<Promotion>? Promotions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Additional configurations if needed
        }
    }
}