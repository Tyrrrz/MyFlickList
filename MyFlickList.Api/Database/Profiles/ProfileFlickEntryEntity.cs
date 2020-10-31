using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Database.Flicks;

namespace MyFlickList.Api.Database.Profiles
{
    public enum ProfileFlickEntryStatus
    {
        Planned,
        Watching,
        Watched,
        Dropped
    }

    // record
    public class ProfileFlickEntryEntity : IHasCreated, IHasUpdated
    {
        public int Id { get; set; }

        public DateTimeOffset Created { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset Updated { get; set; } = DateTimeOffset.Now;

        public ProfileFlickEntryStatus Status { get; set; }

        public int? EpisodeCount { get; set; }

        public double? Rating { get; set; }

        public string? Review { get; set; }

        public int ProfileId { get; set; }

        public ProfileEntity? Profile { get; set; }

        public int FlickId { get; set; }

        public FlickEntity? Flick { get; set; }
    }

    public class ProfileFlickEntryEntityConfiguration : IEntityTypeConfiguration<ProfileFlickEntryEntity>
    {
        public void Configure(EntityTypeBuilder<ProfileFlickEntryEntity> builder)
        {
            builder.Property(o => o.Review)
                .HasMaxLength(20_000);
        }
    }
}