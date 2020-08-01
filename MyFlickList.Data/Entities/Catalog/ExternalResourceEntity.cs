using System;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Data.Entities.Catalog
{
    public enum ExternalResourceKind
    {
        Trailer
    }

    public class ExternalResourceEntity
    {
        public Guid Id { get; set; }

        public ExternalResourceKind Kind { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Url { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string FlickId { get; set; } = default!;

        public FlickEntity? Flick { get; set; }
    }
}