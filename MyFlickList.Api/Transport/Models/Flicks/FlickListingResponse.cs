using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Database.Flicks;

namespace MyFlickList.Api.Transport.Models.Flicks
{
    public class FlickListingResponse
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public FlickKind Kind { get; set; }

        [Required]
        public string Title { get; set; } = default!;

        public DateTimeOffset? FirstAired { get; set; }

        public DateTimeOffset? LastAired { get; set; }

        public int? EpisodeCount { get; set; }

        public TimeSpan? Runtime { get; set; }

        public double? ExternalRating { get; set; }

        public IReadOnlyList<string>? Tags { get; set; }

        public int? CoverImageId { get; set; }
    }
}