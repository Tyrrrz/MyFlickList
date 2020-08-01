using System.Threading.Tasks;
using CliFx;
using CliFx.Attributes;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Data;

namespace MyFlickList.CatalogUpdater.Commands
{
    public abstract class CommandBase : ICommand
    {
        [CommandOption("db", Description = "Database connection string.")]
        public string ConnectionString { get; set; } =
            "Server=localhost;Port=5432;Database=postgres;User ID=postgres;Password=mysecretpassword";

        protected AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(ConnectionString, o =>
                {
                    // Workaround for connecting to AWS/Heroku database directly without installing their certificate locally
                    o.RemoteCertificateValidationCallback((s, crt, chn, err) => true);
                })
                .Options;

            return new AppDbContext(options);
        }

        public abstract ValueTask ExecuteAsync(IConsole console);
    }
}