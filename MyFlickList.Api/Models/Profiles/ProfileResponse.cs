using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Models.Flicks;

namespace MyFlickList.Api.Models.Profiles
{
    public class ProfileResponse
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? TwitterId { get; set; }

        public string? InstagramId { get; set; }

        public string? GitHubId { get; set; }

        public int? AvatarImageId { get; set; }

        public IReadOnlyList<FlickListingResponse>? FavoriteFlicks { get; set; }
    }
}