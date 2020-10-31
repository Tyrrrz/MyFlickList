using System.Collections.Generic;
using MyFlickList.Api.Transport.Models.Flicks;
using MyFlickList.Api.Transport.Models.Profiles;

namespace MyFlickList.Api.Transport.Models.Search
{
    public class SearchResponse
    {
        public IReadOnlyList<FlickListingResponse>? Flicks { get; set; }

        public IReadOnlyList<ProfileListingResponse>? Profiles { get; set; }
    }
}