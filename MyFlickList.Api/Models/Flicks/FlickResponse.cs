using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Flicks
{
    public class FlickResponse : FlickListingResponse
    {
        [Required]
        public string ImdbId { get; set; } = default!;

        public string? OriginalTitle { get; set; }

        public string? Synopsis { get; set; }
    }
}