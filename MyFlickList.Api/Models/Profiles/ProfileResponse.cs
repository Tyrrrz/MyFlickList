using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Models.Flicks;

namespace MyFlickList.Api.Models.Profiles
{
    public class ProfileResponse : ProfileListingResponse
    {
        [Required]
        public UserRole Role { get; set; }

        [Required]
        public bool IsPublic { get; set; }

        public string? Bio { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? TwitterId { get; set; }

        public string? InstagramId { get; set; }

        public string? GitHubId { get; set; }

        public IReadOnlyList<FlickListingResponse>? FavoriteFlicks { get; set; }
    }
}