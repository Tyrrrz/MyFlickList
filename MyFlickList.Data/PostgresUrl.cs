using System;
using Npgsql;

namespace MyFlickList.Data
{
    public static class PostgresUrl
    {
        public static string ToConnectionString(string url)
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
}