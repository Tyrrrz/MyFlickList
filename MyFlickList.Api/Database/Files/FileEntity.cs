using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Api.Database.Files
{
    public class FileEntity
    {
        public int Id { get; set; }

        public byte[] Data { get; set; } = default!;

        public string ContentType { get; set; } = default!;
    }

    public class FileEntityConfiguration : IEntityTypeConfiguration<FileEntity>
    {
        public void Configure(EntityTypeBuilder<FileEntity> builder)
        {
            builder.Property(o => o.Data)
                .IsRequired();

            builder.Property(o => o.ContentType)
                .IsRequired();
        }
    }
}