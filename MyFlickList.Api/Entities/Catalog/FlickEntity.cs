using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Entities.Lists;

namespace MyFlickList.Api.Entities.Catalog
{
    public enum FlickKind { Movie, Series }

    public class FlickEntity
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; } = default!;

        public FlickKind Kind { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Title { get; set; } = default!;

        public DateTimeOffset? PremiereDate { get; set; }

        public DateTimeOffset? FinaleDate { get; set; }

        public TimeSpan? Runtime { get; set; }

        public int? EpisodeCount { get; set; }

        public double? ExternalRating { get; set; }

        public string? Synopsis { get; set; }

        public Guid? ImageId { get; set; }

        public ICollection<ExternalResourceEntity> Resources { get; set; } = new List<ExternalResourceEntity>();

        public ICollection<CharacterEntity> Characters { get; set; } = new List<CharacterEntity>();

        public ICollection<TagLinkEntity> TagLinks { get; set; } = new List<TagLinkEntity>();

        public ICollection<ListedFlickEntity> Listed { get; set; } = new List<ListedFlickEntity>();
    }
}