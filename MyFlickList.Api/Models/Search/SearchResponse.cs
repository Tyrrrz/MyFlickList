using System.Collections.Generic;
using MyFlickList.Api.Models.Flicks;
using MyFlickList.Api.Models.Profiles;

namespace MyFlickList.Api.Models.Search
{
    public class SearchResponse
    {
        public IReadOnlyList<FlickListingResponse>? Flicks { get; set; }

        public IReadOnlyList<ProfileListingResponse>? Profiles { get; set; }
    }
}