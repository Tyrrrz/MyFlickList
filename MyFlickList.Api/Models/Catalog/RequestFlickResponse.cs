using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Catalog
{
    public class RequestFlickResponse
    {
        [Required]
        public string FlickId { get; set; } = default!;
    }
}