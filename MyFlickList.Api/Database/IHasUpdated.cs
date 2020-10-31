using System;

namespace MyFlickList.Api.Database
{
    public interface IHasUpdated
    {
        DateTimeOffset Updated { get; set; }
    }
}