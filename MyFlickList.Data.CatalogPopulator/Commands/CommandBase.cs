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
            var connectionString = !string.IsNullOrWhiteSpace(ConnectionString) && ConnectionString.StartsWith("postgres://")
                ? PostgresUrl.ToConnectionString(ConnectionString)
                : ConnectionString;

            var options = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(connectionString).Options;

            return new AppDbContext(options);
        }

        public abstract ValueTask ExecuteAsync(IConsole console);
    }
}