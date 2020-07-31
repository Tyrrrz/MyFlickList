using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Data.Entities.Lists;

namespace MyFlickList.Data.Entities.Catalog
{
    public enum FlickKind { Movie, Series }

    public class FlickEntity
    {
        [Key]
        public Guid Id { get; set; }

        public FlickKind Kind { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Title { get; set; } = default!;

        public DateTimeOffset? PremiereDate { get; set; }

        public TimeSpan? Runtime { get; set; }

        [Range(1, int.MaxValue)]
        public int? EpisodeCount { get; set; }

        public ICollection<FlickLinkEntity> Links { get; set; } = new List<FlickLinkEntity>();

        public ICollection<FlickMemberEntity> Members { get; set; } = new List<FlickMemberEntity>();

        public ICollection<FlickCharacterEntity> Characters { get; set; } = new List<FlickCharacterEntity>();

        public ICollection<ListedFlickEntity> Listed { get; set; } = new List<ListedFlickEntity>();
    }
}