using System;
using MyFlickList.Api.Internal.Extensions;

namespace MyFlickList.Api.Internal
{
    internal static class Heroku
    {
        public static string? GetDatabaseConnectionString() =>
            Environment.GetEnvironmentVariable("DATABASE_URL")?.Pipe(Postgres.UrlToConnectionString);

        public static string? GetPort() =>
            Environment.GetEnvironmentVariable("PORT");
    }
}