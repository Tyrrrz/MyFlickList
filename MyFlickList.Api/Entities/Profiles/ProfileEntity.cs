using System;
using MyFlickList.Api.Entities.Auth;

namespace MyFlickList.Api.Entities.Profiles
{
    public class ProfileEntity
    {
        public int Id { get; set; }

        public bool IsPublic { get; set; } = true;

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public string[] ExternalLinks { get; set; } = Array.Empty<string>();

        public int? AvatarImageId { get; set; }

        public int UserId { get; set; }

        public UserEntity? User { get; set; }
    }
}