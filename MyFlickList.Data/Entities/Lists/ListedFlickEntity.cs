using System;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data.Entities.Lists
{
    public class ListedFlickEntity
    {
        public Guid Id { get; set; }

        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }
    }
}