using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Api.Entities.Flicks
{
    public enum FlickKind : byte { Movie, Series }

    public class FlickEntity : IHasCreated
    {
        public int Id { get; set; }

        public FlickKind Kind { get; set; }

        public string ImdbId { get; set; } = default!;

        public string Title { get; set; } = default!;

        public string? OriginalTitle { get; set; }

        public DateTimeOffset? PremiereDate { get; set; }

        public DateTimeOffset? FinaleDate { get; set; }

        public int? EpisodeCount { get; set; }

        public TimeSpan? Runtime { get; set; }

        public double? ExternalRating { get; set; }

        public string? Synopsis { get; set; }

        public DateTimeOffset Created { get; set; } = DateTimeOffset.UtcNow;

        public int? CoverImageId { get; set; }

        public ICollection<FlickExternalLinkEntity> ExternalLinks { get; set; } = new List<FlickExternalLinkEntity>();

        public ICollection<FlickTagEntity> Tags { get; set; } = new List<FlickTagEntity>();
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

            builder.HasMany(o => o.ExternalLinks)
                .WithOne(o => o.Flick!)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(o => o.Tags)
                .WithOne(o => o.Flick!)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}