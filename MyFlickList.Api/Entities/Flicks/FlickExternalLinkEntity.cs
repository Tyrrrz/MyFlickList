using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Api.Entities.Flicks
{
    public enum FlickExternalLinkKind : byte
    {
        OfficialWebsite,
        Trailer
    }

    public class FlickExternalLinkEntity
    {
        public int Id { get; set; }

        public FlickExternalLinkKind Kind { get; set; }

        public string Url { get; set; } = default!;

        public int FlickId { get; set; }

        public FlickEntity? Flick { get; set; }
    }

    public class FlickExternalLinkEntityConfiguration : IEntityTypeConfiguration<FlickExternalLinkEntity>
    {
        public void Configure(EntityTypeBuilder<FlickExternalLinkEntity> builder)
        {
            builder.HasIndex(o => new {o.FlickId, o.Url})
                .IsUnique();

            builder.Property(o => o.Url)
                .IsRequired()
                .HasMaxLength(2048);
        }
    }
}