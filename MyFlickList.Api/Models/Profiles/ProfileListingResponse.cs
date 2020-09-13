using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Profiles
{
    public class ProfileListingResponse
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        public string? Location { get; set; }

        public int? AvatarImageId { get; set; }
    }
}