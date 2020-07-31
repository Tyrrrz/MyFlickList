using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data.Entities.Lists
{
    public class ListedFlickEntity
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Flick))]
        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }
    }
}