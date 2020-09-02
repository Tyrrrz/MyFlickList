using System;

namespace MyFlickList.Api.Entities
{
    public interface IHasCreated
    {
        DateTimeOffset Created { get; set; }
    }
}