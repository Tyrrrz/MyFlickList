using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MyFlickList.Api
{
    public static class Program
    {
        private static IHost CreateHost(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(o =>
                {
                    o.UseStartup<Startup>();
                    o.UseSentry();
                })
                .Build();

        private static async Task ApplyMigrationsAsync(IHost host)
        {
            using var scope = host.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await dbContext.Database.MigrateAsync();
        }

        public static async Task Main(string[] args)
        {
            var host = CreateHost(args);

            await ApplyMigrationsAsync(host);
            await host.RunAsync();
        }
    }
}