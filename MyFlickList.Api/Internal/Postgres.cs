using System;
using Npgsql;

namespace MyFlickList.Api.Internal
{
    internal static partial class Postgres
    {
        public static string UrlToConnectionString(string url)
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
    }

    internal partial class Postgres
    {
        // DB Functions
        public static class Functions
        {
            public static string Unaccent(string value) =>
                throw new InvalidOperationException("This method is not meant to be called directly.");
        }
    }
}