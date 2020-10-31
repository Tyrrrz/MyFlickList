using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Database.Auth;

namespace MyFlickList.Api.Transport.Models.Profiles
{
    public class ProfileResponse : ProfileListingResponse
    {
        [Required]
        public UserRole Role { get; set; }

        [Required]
        public bool IsPublic { get; set; }

        public string? Bio { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }
    }
}