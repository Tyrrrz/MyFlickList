using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFlickList.Data.Entities.Catalog
{
    public class TagLinkEntity
    {
        [Required(AllowEmptyStrings = false)]
        public string FlickId { get; set; } = default!;

        public FlickEntity? Flick { get; set; }

        [Required(AllowEmptyStrings = false)]
        [ForeignKey(nameof(Tag))]
        public string TagName { get; set; } = default!;

        public TagEntity? Tag { get; set; }
    }
}