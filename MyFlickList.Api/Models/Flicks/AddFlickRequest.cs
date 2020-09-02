using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Flicks
{
    public class AddFlickRequest
    {
        [Required]
        public string SourceUrl { get; set; } = default!;
    }
}