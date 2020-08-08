using System;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Entities.Catalog
{
    public class CharacterEntity
    {
        public Guid Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string FlickId { get; set; } = default!;

        public FlickEntity? Flick { get; set; }

        [Required]
        public Guid ActorId { get; set; }

        public ActorEntity? Actor { get; set; }
    }
}