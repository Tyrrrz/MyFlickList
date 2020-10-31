using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Transport.Models.Flicks
{
    public class AddFlickResponse
    {
        [Required]
        public int FlickId { get; set; }
    }
}