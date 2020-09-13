using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Models.Profiles
{
    public class UpdateProfileRequest
    {
        public bool IsPublic { get; set; }

        public string? Location { get; set; }

        public string? Bio { get; set; }

        [StringLength(2048)]
        public string? WebsiteUrl { get; set; }

        [StringLength(15)]
        public string? TwitterId { get; set; }

        [StringLength(30)]
        public string? InstagramId { get; set; }

        [StringLength(39)]
        public string? GitHubId { get; set; }
    }
}