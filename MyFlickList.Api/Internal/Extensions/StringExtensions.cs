using System.Text.RegularExpressions;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class StringExtensions
    {
        public static string ToHumanWords(this string str) =>
            Regex.Replace(str, @"(\p{Ll})(\p{Lu})", "$1 $2");
    }
}