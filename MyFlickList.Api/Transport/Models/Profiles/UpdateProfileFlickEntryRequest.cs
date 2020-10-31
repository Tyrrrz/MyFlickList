using MyFlickList.Api.Database.Profiles;

namespace MyFlickList.Api.Transport.Models.Profiles
{
    public class UpdateProfileFlickEntryRequest
    {
        public ProfileFlickEntryStatus Status { get; set; }

        public int? EpisodeCount { get; set; }

        public double? Rating { get; set; }

        public string? Review { get; set; }
    }
}