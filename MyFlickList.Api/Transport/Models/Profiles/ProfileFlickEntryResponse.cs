using System.ComponentModel.DataAnnotations;
using MyFlickList.Api.Database.Profiles;

namespace MyFlickList.Api.Transport.Models.Profiles
{
    public class ProfileFlickEntryResponse
    {
        [Required]
        public ProfileFlickEntryStatus Status { get; set; }

        public int? EpisodeCount { get; set; }

        public double? Rating { get; set; }

        public string? Review { get; set; }

        [Required]
        public int ProfileId { get; set; }

        [Required]
        public int FlickId { get; set; }

        [Required]
        public string FlickTitle { get; set; } = default!;

        public int? FlickCoverImageId { get; set; }
    }
}