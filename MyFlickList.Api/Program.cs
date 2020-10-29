using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api
{
    public static class Program
    {
        // This signature is required for EF and NSwag design-time tools to work
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(o =>
                {
                    o.UseStartup<Startup>();
                    o.UseSentry();

                    if (Heroku.GetPort() is {} port)
                    {
                        o.UseUrls("http://*:" + port);
                    }
                });

        private static async Task ApplyMigrationsAsync(IHost host)
        {
            using var scope = host.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await dbContext.Database.MigrateAsync();
        }

        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            await ApplyMigrationsAsync(host);
            await host.RunAsync();
        }
    }
}