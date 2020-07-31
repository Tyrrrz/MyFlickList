using System;

namespace MyFlickList.Data.Entities.Catalog
{
    public class TagLinkEntity
    {
        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }

        public Guid TagId { get; set; }

        public TagEntity? Tag { get; set; }
    }
}