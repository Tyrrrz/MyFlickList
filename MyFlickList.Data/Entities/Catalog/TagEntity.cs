using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Data.Entities.Catalog
{
    public class TagEntity
    {
        [Key]
        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; } = default!;

        public ICollection<TagLinkEntity> TagLinks { get; set; } = new List<TagLinkEntity>();
    }
}