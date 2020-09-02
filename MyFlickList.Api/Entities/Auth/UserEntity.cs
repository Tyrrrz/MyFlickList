using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Entities.Profiles;

namespace MyFlickList.Api.Entities.Auth
{
    public class UserEntity : IHasCreated
    {
        public int Id { get; set; }

        public string Username { get; set; } = default!;

        public string Email { get; set; } = default!;

        public bool IsEmailConfirmed { get; set; }

        public byte[] PasswordHash { get; set; } = default!;

        public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;

        public ProfileEntity? Profile { get; set; }
    }

    public class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            // TODO: case-insensitive collation (.NET 5)
            builder.HasIndex(o => o.Username)
                .IsUnique();

            builder.HasIndex(o => o.Email)
                .IsUnique();

            builder.Property(o => o.Username)
                .IsRequired()
                .HasMaxLength(48);

            builder.Property(o => o.Email)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(o => o.PasswordHash)
                .IsRequired();

            builder.Property(o => o.Created)
                .IsRequired();

            builder.HasOne(o => o.Profile)
                .WithOne(o => o!.User!)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}