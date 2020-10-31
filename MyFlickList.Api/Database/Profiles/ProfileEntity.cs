using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Database.Auth;

namespace MyFlickList.Api.Database.Profiles
{
    public class ProfileEntity
    {
        public int Id { get; set; }

        public bool IsPublic { get; set; } = true;

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public string[] ExternalLinks { get; set; } = Array.Empty<string>();

        public int? AvatarImageId { get; set; }

        public int UserId { get; set; }

        public UserEntity? User { get; set; }

        public ICollection<ProfileFlickEntryEntity> FlickEntries { get; set; } = new List<ProfileFlickEntryEntity>();
    }

    public class ProfileEntityConfiguration : IEntityTypeConfiguration<ProfileEntity>
    {
        public void Configure(EntityTypeBuilder<ProfileEntity> builder)
        {
            builder.HasMany(o => o.FlickEntries)
                .WithOne(o => o.Profile!)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}