using System;
using System.ComponentModel.DataAnnotations;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data.Entities.Lists
{
    public class ListedFlickEntity
    {
        public Guid Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string FlickId { get; set; } = default!;

        public FlickEntity? Flick { get; set; }
    }
}