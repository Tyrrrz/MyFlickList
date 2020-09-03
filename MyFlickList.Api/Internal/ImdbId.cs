using System;
using System.Text.RegularExpressions;

namespace MyFlickList.Api.Internal
{
    internal static class ImdbId
    {
        public static string? TryFromUrl(string url)
        {
            // https://imdb.com/title/tt0168366

            if (!Uri.TryCreate(url, UriKind.Absolute, out var parsedUrl))
                return null;

            if (!parsedUrl.Host.Equals("imdb.com", StringComparison.OrdinalIgnoreCase) &&
                !parsedUrl.Host.EndsWith(".imdb.com", StringComparison.OrdinalIgnoreCase))
                return null;

            var id = Regex.Match(parsedUrl.PathAndQuery, @"title/(tt\d+)", RegexOptions.IgnoreCase).Groups[1].Value;
            if (string.IsNullOrWhiteSpace(id))
                return null;

            return id;
        }
    }
}