using Microsoft.EntityFrameworkCore;
using web_Trang_suc_BE.Models.Entities;

namespace web_Trang_suc_BE.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ProductVariant> ProductVariants { get; set; } = null!;
        public DbSet<ProductImage> ProductImages { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Material> Materials { get; set; } = null!;
        public DbSet<Cart> Carts { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Wishlist> Wishlists { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!;
        public DbSet<Service> Services { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Promotion> Promotions { get; set; } = null!;
        public DbSet<UserVoucher> UserVouchers { get; set; } = null!;
        public DbSet<ShopSetting> ShopSettings { get; set; } = null!;
        public DbSet<Banner> Banners { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Composite Keys
            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.ProductId });

            modelBuilder.Entity<Wishlist>()
                .HasKey(w => new { w.UserId, w.ProductId });
        }
    }
}