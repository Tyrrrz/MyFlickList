using Microsoft.EntityFrameworkCore;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<ActorEntity> Actors { get; set; } = default!;

        public DbSet<CharacterEntity> Characters { get; set; } = default!;

        public DbSet<ExternalResourceEntity> ExternalResources { get; set; } = default!;

        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public DbSet<ImageEntity> Images { get; set; } = default!;

        public DbSet<TagEntity> Tags { get; set; } = default!;

        public DbSet<TagLinkEntity> TagLinks { get; set; } = default!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Catalog

            modelBuilder.Entity<TagLinkEntity>(
                e => e.HasKey(o => new {o.FlickId, o.TagName})
            );
        }
    }
}