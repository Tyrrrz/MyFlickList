using System;
using System.ComponentModel.DataAnnotations;

namespace MyFlickList.Api.Entities.Catalog
{
    public class ImageEntity
    {
        public Guid Id { get; set; }

        [Required]
        public byte[] Data { get; set; } = Array.Empty<byte>();

        [Required(AllowEmptyStrings = false)]
        public string ContentType { get; set; } = default!;
    }
}