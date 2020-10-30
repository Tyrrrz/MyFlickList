using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Api.Entities.Flicks
{
    public enum FlickKind : byte { Movie, Series }

    public class FlickEntity : IHasCreated
    {
        public int Id { get; set; }

        public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;

        public FlickKind Kind { get; set; }

        public string ImdbId { get; set; } = default!;

        public string Title { get; set; } = default!;

        public string? OriginalTitle { get; set; }

        public DateTimeOffset? FirstAired { get; set; }

        public DateTimeOffset? LastAired { get; set; }

        public int? EpisodeCount { get; set; }

        public TimeSpan? Runtime { get; set; }

        public double? ExternalRating { get; set; }

        public string? Synopsis { get; set; }

        public string[] ExternalLinks { get; set; } = Array.Empty<string>();

        public string[] Tags { get; set; } = Array.Empty<string>();

        public int? CoverImageId { get; set; }
    }

    public class FlickEntityConfiguration : IEntityTypeConfiguration<FlickEntity>
    {
        public void Configure(EntityTypeBuilder<FlickEntity> builder)
        {
            builder.HasIndex(o => o.ImdbId)
                .IsUnique();

            builder.Property(o => o.ImdbId)
                .IsRequired()
                .HasMaxLength(12);

            builder.Property(o => o.Title)
                .IsRequired();
        }
    }
}