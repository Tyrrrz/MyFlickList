using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Flicks
{
    public class AddFlickResponse
    {
        [Required]
        public int FlickId { get; set; }
    }
}