using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database.Auth;
using MyFlickList.Api.Database.Files;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Database.Profiles;

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
            : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasPostgresExtension("unaccent");
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);
        }
    }
}