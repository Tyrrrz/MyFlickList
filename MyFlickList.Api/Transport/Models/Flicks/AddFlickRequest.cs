using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Flicks
{
    public class AddFlickRequest
    {
        [Required]
        public string SourceUrl { get; set; } = default!;
    }
}