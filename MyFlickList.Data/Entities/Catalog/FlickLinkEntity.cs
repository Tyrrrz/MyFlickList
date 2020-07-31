using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFlickList.Data.Entities.Catalog
{
    public enum FlickLinkKind
    {
        Trailer
    }

    public class FlickLinkEntity
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Flick))]
        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }

        public FlickLinkKind Kind { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Url { get; set; } = default!;
    }
}