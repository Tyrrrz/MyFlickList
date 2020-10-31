using System;
using Microsoft.AspNetCore.Hosting;
using Npgsql;

namespace MyFlickList.Api.Internal
{
    internal static class HerokuIntegration
    {
        private static string ConnectionStringFromUrl(string url)
        {
            // postgres://user:password@host:port/database

            var uri = new Uri(url);
            var builder = new NpgsqlConnectionStringBuilder();

            var userParts = uri.UserInfo.Split(':');

            builder.Username = userParts[0];
            builder.Password = userParts[1];
            builder.Host = uri.Host;
            builder.Port = uri.Port;
            builder.Database = uri.AbsolutePath.TrimStart('/');
            builder.SslMode = SslMode.Prefer;
            builder.TrustServerCertificate = true;

            return builder.ConnectionString;
        }

        public static void UseHeroku(this IWebHostBuilder webHost)
        {
            // Port settings
            var port = Environment.GetEnvironmentVariable("PORT");
            if (!string.IsNullOrWhiteSpace(port))
            {
                webHost.UseUrls("http://*:" + port);
            }

            // Database settings
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (!string.IsNullOrWhiteSpace(databaseUrl))
            {
                Environment.SetEnvironmentVariable(
                    "ConnectionStrings__Database",
                    ConnectionStringFromUrl(databaseUrl)
                );
            }
        }
    }
}