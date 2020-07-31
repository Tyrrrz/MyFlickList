using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFlickList.Data.Entities.Catalog
{
    public class FlickMemberEntity
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Flick))]
        public Guid FlickId { get; set; }

        public FlickEntity? Flick { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;

        [Required(AllowEmptyStrings = false)]
        public string Role { get; set; } = default!;

        public ICollection<FlickCharacterEntity> Characters { get; set; } = new List<FlickCharacterEntity>();
    }
}