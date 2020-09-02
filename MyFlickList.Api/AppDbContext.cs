using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Entities.Files;
using MyFlickList.Api.Entities.Flicks;
using MyFlickList.Api.Entities.Profiles;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api
{
    public class AppDbContext : DbContext
    {
        public DbSet<FileEntity> Files { get; set; } = default!;

        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public DbSet<FlickExternalLinkEntity> FlickExternalLinks { get; set; } = default!;

        public DbSet<FlickTagEntity> FlickTags { get; set; } = default!;

        public DbSet<UserEntity> Users { get; set; } = default!;

        public DbSet<ProfileEntity> Profiles { get; set; } = default!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TODO: add collations with EFc5
            // http://npgsql.org/efcore/misc/collations-and-case-sensitivity.html?tabs=data-annotations

            // Unaccent extension (will not need when collations are added)
            modelBuilder.HasPostgresExtension("unaccent");
            modelBuilder
                .HasDbFunction(typeof(Postgres.Functions).GetMethod(nameof(Postgres.Functions.Unaccent)))
                .HasName("unaccent");

            // Local configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}