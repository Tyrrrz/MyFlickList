using System;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class GenericExtensions
    {
        public static TOut Pipe<TIn, TOut>(this TIn input, Func<TIn, TOut> transform) => transform(input);

        public static T? NullIf<T>(this T value, bool condition) where T : struct =>
            !condition
                ? value
                : (T?) null;

        public static T? NullIf<T>(this T value, Func<T, bool> predicate) where T : struct =>
            value.NullIf(predicate(value));
    }
}