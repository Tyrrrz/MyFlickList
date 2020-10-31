﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Database.Profiles;

namespace MyFlickList.Api.Database.Auth
{
    public enum UserRole : byte { Normal, Admin }

    public class UserEntity : IHasCreated
    {
        public int Id { get; set; }

        public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;

        public UserRole Role { get; set; } = UserRole.Normal;

        public string Username { get; set; } = default!;

        public string Email { get; set; } = default!;

        public bool IsEmailConfirmed { get; set; }

        public byte[] PasswordHash { get; set; } = default!;

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