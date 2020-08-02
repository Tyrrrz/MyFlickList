using System;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Api.Responses.Catalog
{
    public class FlickResponse
    {
        public string Id { get; set; } = default!;

        public FlickKind Kind { get; set; }

        public string Title { get; set; } = default!;

        public DateTimeOffset? PremiereDate { get; set; }

        public TimeSpan? Runtime { get; set; }

        public int? EpisodeCount { get; set; }

        public string? Synopsis { get; set; }

        public Guid? ImageId { get; set; }
    }
}