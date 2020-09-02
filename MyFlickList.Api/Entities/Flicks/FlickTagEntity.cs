using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Api.Entities.Flicks
{
    public class FlickTagEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = default!;

        public int FlickId { get; set; }

        public FlickEntity? Flick { get; set; }
    }

    public class FlickTagEntityConfiguration : IEntityTypeConfiguration<FlickTagEntity>
    {
        public void Configure(EntityTypeBuilder<FlickTagEntity> builder)
        {
            builder.HasIndex(o => new {o.FlickId, o.Name})
                .IsUnique();

            builder.Property(o => o.Name)
                .IsRequired();
        }
    }
}