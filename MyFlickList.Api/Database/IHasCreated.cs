using System;

namespace MyFlickList.Api.Database
{
    public interface IHasCreated
    {
        DateTimeOffset Created { get; set; }
    }
}