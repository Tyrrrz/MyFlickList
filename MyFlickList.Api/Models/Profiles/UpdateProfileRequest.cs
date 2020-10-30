using System.Collections.Generic;

namespace MyFlickList.Api.Models.Profiles
{
    public class UpdateProfileRequest
    {
        public bool IsPublic { get; set; }

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }
    }
}