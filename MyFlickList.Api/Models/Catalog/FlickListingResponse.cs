using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Entities.Catalog;

namespace MyFlickList.Api.Models.Catalog
{
    public class FlickListingResponse
    {
        [Required]
        public string Id { get; set; } = default!;

        [Required]
        public FlickKind Kind { get; set; }

        [Required]
        public string Title { get; set; } = default!;

        public DateTimeOffset? PremiereDate { get; set; }

        public DateTimeOffset? FinaleDate { get; set; }

        public TimeSpan? Runtime { get; set; }

        public int? EpisodeCount { get; set; }

        public double? ExternalRating { get; set; }

        public Guid? ImageId { get; set; }

        public IReadOnlyList<string> Tags { get; set; } = Array.Empty<string>();
    }
}