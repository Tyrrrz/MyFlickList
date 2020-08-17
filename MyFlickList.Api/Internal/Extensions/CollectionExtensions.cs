using System.Collections.Generic;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class CollectionExtensions
    {
        private static IEnumerable<T> Enumerate<T>(this IEnumerator<T> enumerator, bool includeCurrent)
        {
            if (includeCurrent)
                yield return enumerator.Current;

            while (enumerator.MoveNext())
                yield return enumerator.Current;
        }

        public static IEnumerable<T>? NullIfEmpty<T>(this IEnumerable<T> source)
        {
            using var enumerator = source.GetEnumerator();

            return enumerator.MoveNext()
                ? enumerator.Enumerate(true)
                : null;
        }

        public static void AddRange<T>(this ICollection<T> collection, IEnumerable<T> items)
        {
            foreach (var item in items)
                collection.Add(item);
        }
    }
}