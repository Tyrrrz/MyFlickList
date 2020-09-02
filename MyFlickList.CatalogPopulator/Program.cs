using System.Threading.Tasks;
using CliFx;

namespace MyFlickList.CatalogPopulator
{
    public static class Program
    {
        public static async Task Main(string[] args) => await new CliApplicationBuilder()
            .AddCommandsFromThisAssembly()
            .Build()
            .RunAsync(args);
    }
}