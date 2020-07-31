using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Data.Entities.Catalog
{
    public class ActorEntity
    {
        public Guid Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;

        public ICollection<CharacterEntity> Characters { get; set; } = new List<CharacterEntity>();
    }
}