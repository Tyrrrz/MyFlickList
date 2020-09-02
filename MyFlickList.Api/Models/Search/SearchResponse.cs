using System.Collections.Generic;
using MyFlickList.Api.Models.Flicks;

namespace MyFlickList.Api.Models.Search
{
    public class SearchResponse
    {
        public IReadOnlyList<FlickListingResponse>? Flicks { get; set; }
    }
}