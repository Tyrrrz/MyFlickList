using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Exceptions;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class ConfigurationExtensions
    {
        public static string[] GetAllowedOrigins(this IConfiguration configuration) =>
            configuration.GetSection("AllowedOrigins").Get<string>()?.Pipe(s => s.Split(';')) ??
            throw new ConfigurationException("Missing configuration for allowed CORS origins.");

        public static string GetDatabaseConnectionString(this IConfiguration configuration) =>
            configuration.GetConnectionString("Database") ??
            // The following is set by Heroku directly
            Environment.GetEnvironmentVariable("DATABASE_URL")?.Pipe(Postgres.UrlToConnectionString!) ??
            throw new ConfigurationException("Missing configuration for database connection string.");

        private static IConfigurationSection? GetApiKeysSection(this IConfiguration configuration) =>
            configuration.GetSection("ApiKeys");

        public static string GetTmdbApiKey(this IConfiguration configuration) =>
            configuration.GetApiKeysSection()?.GetValue<string>("Tmdb") ??
            throw new ConfigurationException("Missing configuration for TMDB API key.");

        private static IConfigurationSection? GetJwtSection(this IConfiguration configuration) =>
            configuration.GetSection("Jwt");

        public static string GetJwtIssuer(this IConfiguration configuration) =>
            configuration.GetJwtSection()?.GetValue<string>("Issuer") ??
            throw new ConfigurationException("Missing configuration for JWT issuer.");

        public static byte[] GetJwtSecret(this IConfiguration configuration) =>
            configuration.GetJwtSection()?.GetValue<string>("Secret")?.Pipe(Encoding.UTF8.GetBytes) ??
            throw new ConfigurationException("Missing configuration for JWT secret.");

        public static TimeSpan GetJwtExpiration(this IConfiguration configuration) =>
            configuration.GetJwtSection()?.GetValue<int?>("ExpirationDays")?.Pipe(d => TimeSpan.FromDays(d)) ??
            throw new ConfigurationException("Missing configuration for JWT expiration.");

        public static bool GetJwtRequireHttps(this IConfiguration configuration) =>
            configuration.GetJwtSection()?.GetValue<bool?>("RequireHttps") ?? true;
    }
}