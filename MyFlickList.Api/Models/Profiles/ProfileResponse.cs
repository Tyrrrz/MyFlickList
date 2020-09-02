using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Profiles
{
    public class ProfileResponse
    {
        [Required]
        public string Name { get; set; } = default!;

        public string? Bio { get; set; }

        public int? AvatarImageId { get; set; }
    }
}