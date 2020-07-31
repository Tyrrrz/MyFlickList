using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFlickList.Data.Entities.Catalog
{
    public class FlickCharacterEntity
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Flick))]
        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }

        [ForeignKey(nameof(Actor))]
        public Guid ActorId { get; set; }

        public FlickMemberEntity? Actor { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;
    }
}