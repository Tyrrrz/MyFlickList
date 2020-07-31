using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyFlickList.Data.Internal.Extensions
{
    internal static class DbContextExtensions
    {
        public static void Entity<T>(this ModelBuilder modelBuilder, params Action<EntityTypeBuilder<T>>[] builderActions) where T : class
        {
            foreach (var builderAction in builderActions)
                modelBuilder.Entity(builderAction);
        }
    }
}