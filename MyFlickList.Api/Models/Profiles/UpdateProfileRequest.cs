namespace MyFlickList.Api.Models.Profiles
{
    public class UpdateProfileRequest
    {
        public string? Location { get; set; }

        public string? Bio { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? TwitterId { get; set; }

        public string? InstagramId { get; set; }

        public string? GitHubId { get; set; }
    }
}