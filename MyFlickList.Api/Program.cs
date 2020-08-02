using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyFlickList.Data;

namespace MyFlickList.Api
{
    public static class Program
    {
        private static IHostBuilder CreateHostBuilder(string[] args) => Host
            .CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(b => b.UseStartup<Startup>());

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