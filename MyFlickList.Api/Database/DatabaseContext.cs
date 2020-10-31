using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database.Auth;
using MyFlickList.Api.Database.Files;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Database.Profiles;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api.Database
{
    public class DatabaseContext : DbContext
    {
        public DbSet<FileEntity> Files { get; set; } = default!;

        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public DbSet<UserEntity> Users { get; set; } = default!;

        public DbSet<ProfileEntity> Profiles { get; set; } = default!;

        public DbSet<ProfileFlickEntryEntity> ProfileFlickEntries { get; set; } = default!;

        public DatabaseContext(DbContextOptions<DatabaseContext> options)
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
                .HasDbFunction(typeof(Postgres.Functions).GetMethod(nameof(Postgres.Functions.Unaccent))!)
                .HasName("unaccent");

            // Local configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);
        }
    }
}