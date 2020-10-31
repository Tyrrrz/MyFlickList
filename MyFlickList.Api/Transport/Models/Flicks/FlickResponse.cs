using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Flicks
{
    public class FlickResponse : FlickListingResponse
    {
        [Required]
        public string ImdbId { get; set; } = default!;

        public string? OriginalTitle { get; set; }

        public string? Synopsis { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }
    }
}