using Microsoft.EntityFrameworkCore;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<FlickEntity> Flicks { get; set; } = default!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}