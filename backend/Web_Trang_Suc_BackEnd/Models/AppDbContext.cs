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
        public DbSet<ProductImage>? ProductImages { get; set; }
        public DbSet<Category>? Categories { get; set; }
        public DbSet<Material>? Materials { get; set; }
        public DbSet<Order>? Orders { get; set; }
        public DbSet<OrderItem>? OrderItems { get; set; }
        public DbSet<Favorite>? Favorites { get; set; }
        public DbSet<ShopSetting>? ShopSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Composite Key for Favorites
            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.ProductId });
        }
    }
}