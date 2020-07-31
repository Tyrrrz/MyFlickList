using Microsoft.EntityFrameworkCore;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Catalog

            modelBuilder.Entity<TagLinkEntity>(
                e => e.HasKey(o => new {o.FlickId, o.TagId})
            );

            modelBuilder.Entity<ImageEntity>(
                e => e.Property(o => o.Data).HasColumnType("blob")
            );
        }
    }
}