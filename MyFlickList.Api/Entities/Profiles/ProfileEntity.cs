using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFlickList.Api.Entities.Auth;

namespace MyFlickList.Api.Entities.Profiles
{
    public class ProfileEntity
    {
        public int Id { get; set; }

        public bool IsPublic { get; set; } = true;

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? TwitterId { get; set; }

        public string? InstagramId { get; set; }

        public string? GitHubId { get; set; }

        public int? AvatarImageId { get; set; }

        public int UserId { get; set; }

        public UserEntity? User { get; set; }
    }

    public class ProfileEntityConfiguration : IEntityTypeConfiguration<ProfileEntity>
    {
        public void Configure(EntityTypeBuilder<ProfileEntity> builder)
        {
            builder.Property(o => o.WebsiteUrl)
                .HasMaxLength(2048);

            builder.Property(o => o.TwitterId)
                .HasMaxLength(15);

            builder.Property(o => o.InstagramId)
                .HasMaxLength(30);

            builder.Property(o => o.GitHubId)
                .HasMaxLength(39);
        }
    }
}