using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Entities.Auth;

namespace MyFlickList.Api.Entities.Profiles
{
    public class ProfileEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = default!;

        public bool IsPublic { get; set; } = true;

        public string? Bio { get; set; }

        public int? AvatarImageId { get; set; }

        public int UserId { get; set; }

        public UserEntity? User { get; set; }
    }

    public class ProfileEntityConfiguration : IEntityTypeConfiguration<ProfileEntity>
    {
        public void Configure(EntityTypeBuilder<ProfileEntity> builder)
        {
            builder.Property(o => o.Name)
                .IsRequired()
                .HasMaxLength(48);
        }
    }
}