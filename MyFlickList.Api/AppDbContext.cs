using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Entities.Catalog;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api
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
            // Unaccent extension
            modelBuilder.HasPostgresExtension("unaccent");
            modelBuilder.HasDbFunction(typeof(Postgres).GetMethod(nameof(Postgres.Unaccent))).HasName("unaccent");

            // Catalog

            modelBuilder.Entity<FlickEntity>(
                e => e.HasOne<ImageEntity>().WithOne().HasForeignKey<FlickEntity>(o => o.ImageId)
            );

            modelBuilder.Entity<TagLinkEntity>(
                e => e.HasKey(o => new {o.FlickId, o.TagName})
            );
        }
    }
}