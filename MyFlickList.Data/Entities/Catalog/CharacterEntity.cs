using System;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Data.Entities.Catalog
{
    public class CharacterEntity
    {
        public Guid Id { get; set; }

        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }

        public Guid ActorId { get; set; }

        public ActorEntity? Actor { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;
    }
}