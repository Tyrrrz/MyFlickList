using System.Threading.Tasks;
using CliFx;

namespace MyFlickList.CatalogUpdater
{
    public static class Program
    {
        public static async Task Main(string[] args) => await new CliApplicationBuilder()
            .AddCommandsFromThisAssembly()
            .Build()
            .RunAsync(args);
    }
}