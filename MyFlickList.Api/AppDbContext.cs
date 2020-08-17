using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Entities.Catalog;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api
{
    public class AppDbContext : IdentityUserContext<UserEntity, Guid>
    {
        public DbSet<ActorEntity> Actors { get; set; } = default!;

        public DbSet<CharacterEntity> Characters { get; set; } = default!;

        public DbSet<ExternalResourceEntity> ExternalResources { get; set; } = default!;

        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public DbSet<ImageEntity> Images { get; set; } = default!;

        public DbSet<TagEntity> Tags { get; set; } = default!;

        public DbSet<FlickTagEntity> FlickTags { get; set; } = default!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unaccent extension
            modelBuilder.HasPostgresExtension("unaccent");
            modelBuilder.HasDbFunction(typeof(Postgres).GetMethod(nameof(Postgres.Unaccent))).HasName("unaccent");

            // Auth
            modelBuilder.Entity<UserEntity>().ToTable("Users");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

            // Catalog
            modelBuilder.Entity<FlickTagEntity>().HasKey(o => new {o.FlickId, o.TagName});
        }
    }
}